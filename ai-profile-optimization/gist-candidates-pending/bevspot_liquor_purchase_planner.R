library(readxl)
library(janitor)
library(tidyverse)
library(stringr)

# Liquor & Beer Purchase Planner — Bevspot Excel export → purchase order.
#
# Reads four Bevspot Excel exports via file.choose():
#   1. Sales report (period to analyze)
#   2. Expected inventory (current theoretical on-hand from Bevspot)
#   3. Recipes (cocktail ingredients with quantities, e.g. "Vodka (1.5 oz), OJ (2 oz)")
#   4. Items catalog (product names, sizes, unit costs, distributors)
#
# Core logic: expand multi-ingredient recipe strings → join to sales counts →
# sum ounce consumption per base spirit → convert to bottle equivalents →
# subtract on-hand → output sorted purchase list with dollar impact.
# Filters to Spirit/Liquor category; supports 750mL and 1L bottles.

ounces_in_750  <- 25.3605
ounces_in_liter <- 33.815

get_tables_from_files <- function() {
  sales_DF <<- read_excel(file.choose()) %>%
    slice(-1) %>%
    janitor::clean_names() %>%
    select(item_name, pos_id, number_sold, sales_price) %>%
    arrange(item_name)

  expected_inventory_DF <<- read_excel(file.choose()) %>%
    janitor::clean_names() %>%
    select(c(1, 7)) %>%
    rename(product_name = 1) %>%
    rename(expected = 2) %>%
    filter(!is.na(expected)) %>%
    mutate(expected = round(as.numeric(expected), 1)) %>%
    filter(!is.na(expected))

  recipes_DF <<- read_excel(file.choose()) %>%
    janitor::clean_names()

  items_DF <<- read_excel(file.choose()) %>%
    janitor::clean_names() %>%
    select(x2, x3, x4, x5, x6, x7) %>%
    slice(-1) %>%
    rename(product_name = x2,
           category     = x3,
           subcategory  = x4,
           distributor  = x5,
           bottle_size  = x6,
           unit_price   = x7)
}

# Parses Bevspot recipe strings ("Vodka (1.5 oz), OJ (2 oz)") into one row
# per ingredient, extracting ingredient name, quantity, and unit.
get_all_ingredients <- function(recipes_df) {
  recipes_df %>%
    mutate(ingredient_list = str_split(x3, "\\)\\s*,\\s*", simplify = FALSE)) %>%
    unnest(ingredient_list) %>%
    mutate(ingredient_list = str_c(str_trim(ingredient_list), ")"),
           ingredient_list = str_replace(ingredient_list, "\\)+$", ")")) %>%
    mutate(
      quantity     = str_extract(ingredient_list, "(?<=\\()[0-9.]+"),
      unit         = str_extract(ingredient_list, "(?<=\\()[0-9.]+\\s*[^)]+") %>%
                       str_remove("^[0-9.]+\\s*"),
      product_name = str_remove(ingredient_list, "\\s*\\([^)]*\\)") %>% str_trim()
    ) %>%
    select(x2, all_items, product_name, quantity, unit) %>%
    rename(recipe_name = all_items,
           pos_id      = x2)
}

# Joins sales to recipe ingredients, sums ounce consumption per spirit,
# converts to bottle counts.
get_merged_mod_DF <- function(sales_df, all_recipes_df) {
  left_join(sales_df, all_recipes_df, by = "pos_id") %>%
    mutate(ounces = as.numeric(quantity)) %>%
    select(-quantity) %>%
    filter(lengths(ounces) == 1) %>%
    group_by(product_name) %>%
    summarise(ounce_total = sum(ounces * number_sold)) %>%
    mutate(sevenfifty_ml_bottles = ceiling(ounce_total / ounces_in_750),
           liter_bottles         = ceiling(ounce_total / ounces_in_liter)) %>%
    arrange(desc(ounce_total))
}

merge_sales_recipes_items <- function(sales_recipes_df, items_df) {
  left_join(sales_recipes_df, items_df, by = "product_name")
}

# Joins on-hand inventory, computes purchase quantities, and formats output.
merge_final <- function(sales_recipes_items_df, expected_inventory_df) {
  left_join(sales_recipes_items_df, expected_inventory_df, by = "product_name") %>%
    mutate(bottle_size = case_when(
      str_detect(bottle_size, "750mL") ~ 750,
      str_detect(bottle_size, "1L")    ~ 1000,
      TRUE                             ~ NA_real_
    )) %>%
    mutate(bottles_sold = case_when(
      bottle_size == 1000 ~ liter_bottles,
      bottle_size == 750  ~ sevenfifty_ml_bottles
    )) %>%
    filter(category %in% c("Spirit", "Liquor")) %>%
    rename(on_hand = expected) %>%
    mutate(on_hand = round(on_hand, 0),
           amt_to_purchase = case_when(
             bottle_size == 1000 ~ liter_bottles - on_hand,
             bottle_size == 750  ~ sevenfifty_ml_bottles - on_hand,
             TRUE                ~ 0
           ),
           unit_price          = as.numeric(str_remove(unit_price, "\\$")),
           increase_to_inventory = amt_to_purchase * unit_price) %>%
    filter(!is.na(unit_price), amt_to_purchase > 0) %>%
    select(-c(liter_bottles, sevenfifty_ml_bottles, ounce_total, category, subcategory)) %>%
    arrange(desc(amt_to_purchase)) %>%
    relocate(product_name, amt_to_purchase, increase_to_inventory,
             on_hand, bottles_sold, unit_price, distributor, bottle_size)
}

# --- Run ---

get_tables_from_files()

recipes_all_DF        <- get_all_ingredients(recipes_DF)
sales_recipes_DF      <- get_merged_mod_DF(sales_DF, recipes_all_DF)
sales_recipes_items_DF <- merge_sales_recipes_items(sales_recipes_DF, items_DF)
final_DF              <- merge_final(sales_recipes_items_DF, expected_inventory_DF)
