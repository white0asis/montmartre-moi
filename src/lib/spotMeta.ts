const PLACE_TYPE_META: Record<string, { icon: string; label: string; plural: string }> = {
  museum: { icon: "🏛️", label: "Museum", plural: "Museums" },
  monument: { icon: "⛪", label: "Monument", plural: "Monuments" },
  park: { icon: "🌳", label: "Park", plural: "Parks" },
  viewpoint: { icon: "🌇", label: "Viewpoint", plural: "Viewpoints" },
  "street-art": { icon: "🎨", label: "Street art", plural: "Street art" },
};

export function placeTypeMeta(type?: string) {
  return type && PLACE_TYPE_META[type]
    ? PLACE_TYPE_META[type]
    : { icon: "📍", label: type || "Place", plural: "Places" };
}

export function restaurantTypeMeta(cuisineType?: string) {
  const isCafe = !!cuisineType && /caf[eé]|brunch/i.test(cuisineType);
  return { icon: isCafe ? "☕" : "🍴", label: cuisineType || "Restaurant" };
}
