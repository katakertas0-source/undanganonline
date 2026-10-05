export interface ServerTemplateOverride {
  id: string;
  slug: string;
  is_active: boolean;
  is_deleted: boolean;
  deleted_at: string | null;
  base_price?: number;
}

// In-memory fallback cache across API requests on server instance
const memoryTemplateOverrides = new Map<string, ServerTemplateOverride>();

export function getMemoryTemplateOverride(idOrSlug: string): ServerTemplateOverride | undefined {
  return memoryTemplateOverrides.get(idOrSlug);
}

export function getAllMemoryTemplateOverrides(): ServerTemplateOverride[] {
  return Array.from(memoryTemplateOverrides.values());
}

export function setMemoryTemplateOverride(override: ServerTemplateOverride): void {
  memoryTemplateOverrides.set(override.id, override);
  memoryTemplateOverrides.set(override.slug, override);
}

export function removeMemoryTemplateOverride(idOrSlug: string): void {
  const existing = memoryTemplateOverrides.get(idOrSlug);
  if (existing) {
    memoryTemplateOverrides.delete(existing.id);
    memoryTemplateOverrides.delete(existing.slug);
  }
}
