-- StandBy Web App - Supabase Database Schema
-- This schema creates all necessary tables and Row Level Security (RLS) policies

-- =====================================================
-- 1. PROFILES TABLE (extends auth.users)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- =====================================================
-- 2. USER PREFERENCES
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  theme TEXT NOT NULL DEFAULT 'auto' CHECK (theme IN ('light', 'dark', 'auto')),
  currency TEXT NOT NULL DEFAULT 'EUR' CHECK (currency IN ('EUR', 'USD', 'GBP')),
  language TEXT NOT NULL DEFAULT 'de' CHECK (language IN ('de', 'en')),
  notifications JSONB NOT NULL DEFAULT '{"budget": true, "calendar": true, "recipes": true}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id)
);

-- =====================================================
-- 3. TRANSACTIONS (Budget - Income & Expenses)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('income', 'expense')),
  amount DECIMAL(10, 2) NOT NULL CHECK (amount > 0),
  category TEXT NOT NULL,
  description TEXT NOT NULL,
  date DATE NOT NULL DEFAULT CURRENT_DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_transactions_user_id ON public.transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON public.transactions(date DESC);
CREATE INDEX IF NOT EXISTS idx_transactions_type ON public.transactions(type);

-- =====================================================
-- 4. BUDGETS (Monthly/Weekly budget limits)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.budgets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  category TEXT NOT NULL,
  limit_amount DECIMAL(10, 2) NOT NULL CHECK (limit_amount > 0),
  period TEXT NOT NULL CHECK (period IN ('weekly', 'monthly')),
  start_date DATE NOT NULL,
  end_date DATE NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (end_date > start_date)
);

CREATE INDEX IF NOT EXISTS idx_budgets_user_id ON public.budgets(user_id);

-- =====================================================
-- 5. SAVINGS GOALS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.savings_goals (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  target_amount DECIMAL(10, 2) NOT NULL CHECK (target_amount > 0),
  current_amount DECIMAL(10, 2) NOT NULL DEFAULT 0 CHECK (current_amount >= 0),
  target_date DATE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_savings_goals_user_id ON public.savings_goals(user_id);

-- =====================================================
-- 6. RECIPES
-- =====================================================
CREATE TABLE IF NOT EXISTS public.recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  prep_time INTEGER NOT NULL CHECK (prep_time >= 0), -- in minutes
  cook_time INTEGER NOT NULL CHECK (cook_time >= 0), -- in minutes
  servings INTEGER NOT NULL CHECK (servings > 0),
  difficulty TEXT NOT NULL CHECK (difficulty IN ('easy', 'medium', 'hard')),
  estimated_cost DECIMAL(10, 2) NOT NULL CHECK (estimated_cost >= 0),
  meal_types TEXT[] NOT NULL, -- ['breakfast', 'lunch', 'dinner', 'snack', 'dessert']
  dietary TEXT[] NOT NULL DEFAULT '{}', -- ['vegetarian', 'vegan', 'gluten-free', 'lactose-free', 'none']
  ingredients JSONB NOT NULL, -- [{"name": "Flour", "amount": 200, "unit": "g"}]
  instructions TEXT[] NOT NULL, -- ["Step 1", "Step 2", ...]
  nutrition JSONB, -- {"calories": 350, "protein": 12, "carbs": 45, "fat": 8}
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Full-text search index for recipes
CREATE INDEX IF NOT EXISTS idx_recipes_title ON public.recipes USING gin(to_tsvector('english', title));
CREATE INDEX IF NOT EXISTS idx_recipes_tags ON public.recipes USING gin(tags);
CREATE INDEX IF NOT EXISTS idx_recipes_meal_types ON public.recipes USING gin(meal_types);
CREATE INDEX IF NOT EXISTS idx_recipes_dietary ON public.recipes USING gin(dietary);

-- =====================================================
-- 7. USER FAVORITE RECIPES (Many-to-Many)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_favorite_recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(user_id, recipe_id)
);

CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON public.user_favorite_recipes(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_recipe_id ON public.user_favorite_recipes(recipe_id);

-- =====================================================
-- 8. SHOPPING LIST ITEMS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.shopping_list_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  recipe_id UUID REFERENCES public.recipes(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  amount DECIMAL(10, 2) NOT NULL DEFAULT 1,
  unit TEXT NOT NULL DEFAULT 'piece',
  checked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_shopping_list_user_id ON public.shopping_list_items(user_id);

-- =====================================================
-- 9. CALENDAR EVENTS
-- =====================================================
CREATE TABLE IF NOT EXISTS public.calendar_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL CHECK (category IN ('uni', 'work', 'personal', 'health', 'social', 'other')),
  start_date TIMESTAMPTZ NOT NULL,
  end_date TIMESTAMPTZ NOT NULL,
  location TEXT,
  reminder TEXT NOT NULL DEFAULT 'none' CHECK (reminder IN ('none', '5min', '15min', '30min', '1hour', '1day')),
  is_all_day BOOLEAN NOT NULL DEFAULT false,
  recurring JSONB, -- {"frequency": "weekly", "interval": 1, "endDate": "2025-12-31"}
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  CHECK (end_date >= start_date)
);

CREATE INDEX IF NOT EXISTS idx_events_user_id ON public.calendar_events(user_id);
CREATE INDEX IF NOT EXISTS idx_events_start_date ON public.calendar_events(start_date);
CREATE INDEX IF NOT EXISTS idx_events_category ON public.calendar_events(category);

-- =====================================================
-- FUNCTIONS: Auto-update updated_at timestamp
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to all tables with updated_at
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_user_preferences_updated_at BEFORE UPDATE ON public.user_preferences
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_transactions_updated_at BEFORE UPDATE ON public.transactions
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_budgets_updated_at BEFORE UPDATE ON public.budgets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_savings_goals_updated_at BEFORE UPDATE ON public.savings_goals
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recipes_updated_at BEFORE UPDATE ON public.recipes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shopping_list_updated_at BEFORE UPDATE ON public.shopping_list_items
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_calendar_events_updated_at BEFORE UPDATE ON public.calendar_events
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- FUNCTION: Auto-create profile on user signup
-- =====================================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, name)
  VALUES (NEW.id, NEW.email, COALESCE(NEW.raw_user_meta_data->>'name', ''));

  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id);

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger on auth.users
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- =====================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.savings_goals ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_favorite_recipes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.shopping_list_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.calendar_events ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- PROFILES: Users can view and update their own profile
-- =====================================================
CREATE POLICY "Users can view their own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

-- =====================================================
-- USER PREFERENCES: Users can manage their own preferences
-- =====================================================
CREATE POLICY "Users can view their own preferences"
  ON public.user_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
  ON public.user_preferences FOR UPDATE
  USING (auth.uid() = user_id);

-- =====================================================
-- TRANSACTIONS: Users can manage their own transactions
-- =====================================================
CREATE POLICY "Users can view their own transactions"
  ON public.transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own transactions"
  ON public.transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own transactions"
  ON public.transactions FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own transactions"
  ON public.transactions FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- BUDGETS: Users can manage their own budgets
-- =====================================================
CREATE POLICY "Users can view their own budgets"
  ON public.budgets FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own budgets"
  ON public.budgets FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own budgets"
  ON public.budgets FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own budgets"
  ON public.budgets FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- SAVINGS GOALS: Users can manage their own savings goals
-- =====================================================
CREATE POLICY "Users can view their own savings goals"
  ON public.savings_goals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own savings goals"
  ON public.savings_goals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own savings goals"
  ON public.savings_goals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own savings goals"
  ON public.savings_goals FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- RECIPES: Public read, admin write (recipes are shared)
-- =====================================================
CREATE POLICY "Anyone can view recipes"
  ON public.recipes FOR SELECT
  TO authenticated
  USING (true);

-- Only admins or service role can insert/update/delete recipes
-- (We'll add recipes via seed data or admin panel later)

-- =====================================================
-- USER FAVORITE RECIPES: Users can manage their favorites
-- =====================================================
CREATE POLICY "Users can view their own favorites"
  ON public.user_favorite_recipes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites"
  ON public.user_favorite_recipes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove favorites"
  ON public.user_favorite_recipes FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- SHOPPING LIST: Users can manage their shopping list
-- =====================================================
CREATE POLICY "Users can view their shopping list"
  ON public.shopping_list_items FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can add items to shopping list"
  ON public.shopping_list_items FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their shopping list items"
  ON public.shopping_list_items FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete shopping list items"
  ON public.shopping_list_items FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- CALENDAR EVENTS: Users can manage their own events
-- =====================================================
CREATE POLICY "Users can view their own events"
  ON public.calendar_events FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own events"
  ON public.calendar_events FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own events"
  ON public.calendar_events FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own events"
  ON public.calendar_events FOR DELETE
  USING (auth.uid() = user_id);
