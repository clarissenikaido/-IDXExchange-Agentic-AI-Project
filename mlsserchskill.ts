import { parsePropertyQuery } from "../modules/nlpParser"; // Built in Week 2
import { searchActiveListings, ListingRow } from "../modules/mlsQueries";

function formatPropertyCard(listing: ListingRow): string {
  return `
🏠 *${listing.L_Address}, ${listing.L_City}*
💰 $${listing.price.toLocaleString()} | 🛏️ ${listing.beds}bd / 🛁 ${listing.baths}ba
📐 ${listing.sqft.toLocaleString()} sqft | 📅 DOM: ${listing.DaysOnMarket}
📸 Photos: ${listing.PhotoCount}
---------------------------------`;
}

export async function mlsSearchSkill(userQuery: string): Promise<string> {
  // 1. Process string into structures using the Week 2 parser
  const filters = await parsePropertyQuery(userQuery); 
  
  // 2. Fetch records safely from rets_property (Page 1, max 5 results)
  const listings = await searchActiveListings(filters, 1, 5);
  
  if (listings.length === 0) {
    return "No active matching listings were found.";
  }
  
  // 3. Render into clean output structures
  const propertyCards = listings.map(formatPropertyCard).join("\n");
  return `Here are the latest matches:\n${propertyCards}`;
}