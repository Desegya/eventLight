import { useState, useEffect } from "react";
import { Category } from "../types/event";
import { apiService } from "../services/api";

let cachedCategories: Category[] | null = null;

export const useCategories = () => {
  const [categories, setCategories] = useState<Category[]>(cachedCategories ?? []);
  const [loading, setLoading] = useState(!cachedCategories);

  useEffect(() => {
    if (cachedCategories) return;
    let cancelled = false;
    apiService.getCategories().then((data) => {
      if (!cancelled) {
        cachedCategories = data;
        setCategories(data);
        setLoading(false);
      }
    }).catch(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, []);

  return { categories, loading };
};
