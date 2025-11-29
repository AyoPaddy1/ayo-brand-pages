# AYO vs Robinhood: Differentiation Strategy

## Core Difference
- **Robinhood**: Transactional (for people who already decided to invest)
- **AYO**: Educational (for fans becoming investment-curious)

---

## Implementation Tasks

### 1. News Section Redesign
**Current**: Generic financial news aggregation  
**Goal**: Curated, translated news that fans understand

#### Tasks:
- [ ] Split news into two streams:
  - **Culture & Brand News** (collabs, athlete moments, viral stuff)
  - **Business News** (earnings, analyst moves) with AYO translation
- [ ] Add filter: "Show me news I can understand"
- [ ] Every headline must pass test: "Would a Nike fan understand why this matters?"
- [ ] Add AYO's one-liner translation below each business headline
- [ ] Example: "Nike Q2 earnings miss by 10%" → "Nike sold less than expected—here's why inventory piled up"

---

### 2. "Related Brands" Based on Fandom, Not Portfolio
**Current**: Nothing (Robinhood shows "People also own" based on portfolio correlation)  
**Goal**: Show brands fans care about, not algorithmic recommendations

#### Tasks:
- [ ] Create "Brands Competing for the Same Fans" section
- [ ] Base recommendations on:
  - **Cultural overlap** (Nike → Jordan Brand, On Running, Lululemon)
  - **Retail partners** (Nike → Foot Locker, Finish Line)
  - **Competitor stealing share** (Nike → On Running, Hoka)
  - **Cultural crossover** (Nike → Spotify, Apple Music for athlete playlists)
- [ ] Add one-liner context: "On Running is stealing Nike's running market share—here's why"

---

### 3. Earnings Chart with Narrative
**Current**: Nothing (Robinhood shows earnings chart with no explanation)  
**Goal**: Never leave data naked—always pair with narrative

#### Tasks:
- [ ] Add earnings history chart (estimated vs actual)
- [ ] Add AYO's one-liner above chart: "Earnings dropped 60% over 18 months—here's why"
- [ ] Link to detailed explanation in story walkthrough
- [ ] Highlight key moments: "This is when inventory started piling up"

---

### 4. Ticker vs Brand Name
**Current**: We use "NKE" prominently  
**Goal**: Lead with brand name, ticker secondary

#### Tasks:
- [ ] Change all "NKE" references to "Nike (NKE)"
- [ ] Use brand name in headlines, charts, buttons
- [ ] Ticker should be in parentheses or smaller text
- [ ] Signal: "We're for fans, not traders"

---

### 5. Social Proof: "Fans Also Watch"
**Current**: Nothing  
**Goal**: Show what other fans are curious about

#### Tasks:
- [ ] Add "Fans Also Watch" section
- [ ] Show brands with similar fandom demographics
- [ ] Add context: "If you're into Nike, you might also want to understand..."
- [ ] Make it feel curated, not algorithmic

---

### 6. Fresh Data Timestamps
**Current**: Social signals update hourly (good!)  
**Goal**: Show freshness everywhere to build trust

#### Tasks:
- [ ] Add "Updated 2 hours ago" to all data sections
- [ ] Show "Live" badge on real-time data
- [ ] Add "Last earnings: Dec 18, 2024" to forecast section

---

## Priority Order
1. **Fix banner positioning and copy** ✅ (Done)
2. **News section redesign** (High impact, differentiates from Robinhood)
3. **Ticker → Brand name** (Quick win, signals who we're for)
4. **Earnings chart with narrative** (Fills gap Robinhood leaves)
5. **"Fans Also Watch"** (Nice to have, builds engagement)
6. **Fresh data timestamps** (Trust builder)
