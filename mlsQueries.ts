// Active Listings Search
export async function searchActiveListings(filters: any, page = 1, limit = 10) {
  const offset = (page - 1) * limit;
  
  let sql = `
    SELECT L_ListingID, L_DisplayId, L_Address, L_City, L_Zip,
           L_SystemPrice AS price, L_Keyword2 AS beds, LM_Dec_3 AS baths,
           LM_Int2_3 AS sqft, L_Type_ AS type, DaysOnMarket, PhotoCount
    FROM rets_property 
    WHERE L_Status = "Active"
  `;
  const params: any[] = [];

  // Conditional filters
  if (filters.city) { sql += " AND L_City = ?"; params.push(filters.city); }
  if (filters.maxPrice) { sql += " AND L_SystemPrice <= ?"; params.push(filters.maxPrice); }
  if (filters.beds) { sql += " AND L_Keyword2 >= ?"; params.push(filters.beds); }
  if (filters.baths) { sql += " AND LM_Dec_3 >= ?"; params.push(filters.baths); }
  if (filters.sqft) { sql += " AND LM_Int2_3 >= ?"; params.push(filters.sqft); }
  if (filters.type) { sql += " AND L_Type_ = ?"; params.push(filters.type); }
  if (filters.pool) { sql += " AND PoolPrivateYN = ?"; params.push(filters.pool); }
  if (filters.hasView) { sql += " AND ViewYN = ?"; params.push(filters.hasView); }

  // Sorting & Pagination Guardrails
  sql += " ORDER BY L_SystemPrice ASC LIMIT ? OFFSET ?";
  params.push(limit, offset);

  return query(sql, params);
}

// Sold Comps Query
export async function getSoldComps(city: string, months = 12) {
  const sql = `
    SELECT ListingKey, UnparsedAddress, City, CloseDate, ClosePrice,
           LivingArea, DaysOnMarket, BedroomsTotal, BathroomsTotalInteger
    FROM california_sold
    WHERE City = ?
      AND CloseDate >= DATE_SUB(CURDATE(), INTERVAL ? MONTH)
      AND PropertyType = "Residential"
    ORDER BY CloseDate DESC
    LIMIT 50
  `;
  return query(sql, [city, months]);
}