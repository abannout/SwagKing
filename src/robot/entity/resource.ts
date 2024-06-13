export type ResourceType = "COAL" | "IRON" | "GEM" | "GOLD" | "PLATIN"
export type ResourceInventory = Record<ResourceType, number>

export function isResourceType(
  resourceType: string
): resourceType is ResourceType {
  return ["COAL", "IRON", "GEM", "GOLD", "PLATIN"].includes(resourceType)
}
