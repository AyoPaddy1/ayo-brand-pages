// Story sections for guided walkthroughs
import { StorySection } from '@/components/GuidedStoryWalkthrough';

export const NIKE_STORY_SECTIONS: StorySection[] = [
  {
    id: 1,
    title: "The Big Picture",
    text: "Nike's had a rough year. The stock's down about 25% since January. But here's why that's not the whole story.",
    scrollTo: "#stock-chart",
    highlight: ".stock-chart-container",
    duration: 5000
  },
  {
    id: 2,
    title: "March: New CEO",
    text: "Back in March, they made a big move — brought back Elliott Hill as CEO. He's a Nike veteran, spent 32 years there before retiring. Wall Street liked that. See this bump in the chart?",
    scrollTo: "#timeline",
    highlight: ".timeline-section",
    duration: 6000
  },
  {
    id: 3,
    title: "June: Earnings Miss",
    text: "But then June happened. Earnings came in weak. Revenue was actually up 1%, but guidance — that's when a company tells investors what to expect next quarter — guidance was terrible. They said sales would drop 10%. The stock fell 12% overnight.",
    scrollTo: "#timeline",
    highlight: ".timeline-section",
    duration: 7000
  },
  {
    id: 4,
    title: "The Fandom Signal",
    text: "Here's what Wall Street is missing: Google searches for Nike are up 77% this week. r/sneakers has 4,400+ engagements. Gen Z is still buying. This is the disconnect — fandom is strong, but the stock hasn't caught up yet.",
    scrollTo: "#social-signals",
    highlight: ".social-signals-section",
    duration: 6000
  },
  {
    id: 5,
    title: "What's Next",
    text: "So what's next? Analysts are watching inventory levels and whether Elliott Hill can turn around the direct-to-consumer strategy. It's a long game, not a quick fix.",
    scrollTo: "#forecast",
    highlight: ".forecast-section",
    duration: 5000
  }
];

export const APPLE_STORY_SECTIONS: StorySection[] = [
  {
    id: 1,
    title: "The Big Picture",
    text: "Apple's been relatively stable this year, but there's more happening beneath the surface than the stock price suggests.",
    scrollTo: "#stock-chart",
    highlight: ".stock-chart-container",
    duration: 5000
  },
  {
    id: 2,
    title: "iPhone Demand",
    text: "iPhone sales have been mixed — strong in the US, but China is a concern. Competition from Huawei is heating up, and that's a market Apple can't afford to lose.",
    scrollTo: "#timeline",
    highlight: ".timeline-section",
    duration: 6000
  },
  {
    id: 3,
    title: "Services Growth",
    text: "Here's the bright spot: Services revenue (Apple Music, iCloud, App Store) is growing steadily. It's now about 20% of total revenue and has much higher margins than hardware.",
    scrollTo: "#timeline",
    highlight: ".timeline-section",
    duration: 6000
  },
  {
    id: 4,
    title: "The Fan Base Stays Loyal",
    text: "Apple searches are up 13% this week. r/apple has 28,000+ engagements — the community is still hyped. Even when iPhone sales slow in China, the core fan base isn't going anywhere. That's the moat.",
    scrollTo: "#social-signals",
    highlight: ".social-signals-section",
    duration: 6000
  },
  {
    id: 5,
    title: "What's Next",
    text: "Watch for the next iPhone cycle and how AI features play out. Apple's betting big on integrating AI into iOS — that could be the next growth driver.",
    scrollTo: "#forecast",
    highlight: ".forecast-section",
    duration: 5000
  }
];

export const TESLA_STORY_SECTIONS: StorySection[] = [
  {
    id: 1,
    title: "The Big Picture",
    text: "Tesla's stock has been volatile this year — driven more by Elon Musk's headlines than by the fundamentals of the car business.",
    scrollTo: "#stock-chart",
    highlight: ".stock-chart-container",
    duration: 5000
  },
  {
    id: 2,
    title: "Cybertruck Production",
    text: "The Cybertruck finally started deliveries, but production has been slower than expected. It's a polarizing product — people either love it or think it looks ridiculous.",
    scrollTo: "#timeline",
    highlight: ".timeline-section",
    duration: 6000
  },
  {
    id: 3,
    title: "EV Competition",
    text: "Competition in the EV market is intensifying. Chinese manufacturers like BYD are undercutting Tesla on price, and traditional automakers are catching up on technology.",
    scrollTo: "#timeline",
    highlight: ".timeline-section",
    duration: 6000
  },
  {
    id: 4,
    title: "The Elon Effect",
    text: "r/teslamotors has 20,000+ engagements this week. Elon's tweets still move the stock — literally. When he posts about Cybertruck or FSD, searches spike. It's chaotic, but it keeps Tesla in the conversation.",
    scrollTo: "#social-signals",
    highlight: ".social-signals-section",
    duration: 6000
  },
  {
    id: 5,
    title: "What's Next",
    text: "The big question is whether Tesla can maintain its premium pricing as competition heats up. And whether Musk's distractions hurt or help the brand long-term.",
    scrollTo: "#forecast",
    highlight: ".forecast-section",
    duration: 5000
  }
];

export const NETFLIX_STORY_SECTIONS: StorySection[] = [
  {
    id: 1,
    title: "The Big Picture",
    text: "Netflix has had a comeback year after a rough 2022. The stock is up, but the streaming wars are far from over.",
    scrollTo: "#stock-chart",
    highlight: ".stock-chart-container",
    duration: 5000
  },
  {
    id: 2,
    title: "Password Crackdown",
    text: "The password-sharing crackdown actually worked. Millions of people who were using someone else's account signed up for their own. Wall Street was surprised — in a good way.",
    scrollTo: "#timeline",
    highlight: ".timeline-section",
    duration: 6000
  },
  {
    id: 3,
    title: "Ad Tier Launch",
    text: "Netflix launched a cheaper ad-supported tier. It's growing faster than expected and could be a major revenue driver as ad budgets shift from traditional TV to streaming.",
    scrollTo: "#timeline",
    highlight: ".timeline-section",
    duration: 6000
  },
  {
    id: 4,
    title: "The Content Machine",
    text: "Netflix searches are up 53% this week. r/netflix has 5,000+ engagements. When a show goes viral on TikTok, it drives subscriptions. That's the flywheel — content creates buzz, buzz drives growth.",
    scrollTo: "#social-signals",
    highlight: ".social-signals-section",
    duration: 6000
  },
  {
    id: 5,
    title: "What's Next",
    text: "The challenge is sustaining subscriber growth as the market matures. Content spending is still huge — can they keep producing hits without burning cash?",
    scrollTo: "#forecast",
    highlight: ".forecast-section",
    duration: 5000
  }
];

export function getStorySections(ticker: string): StorySection[] {
  switch (ticker.toUpperCase()) {
    case 'NKE':
      return NIKE_STORY_SECTIONS;
    case 'AAPL':
      return APPLE_STORY_SECTIONS;
    case 'TSLA':
      return TESLA_STORY_SECTIONS;
    case 'NFLX':
      return NETFLIX_STORY_SECTIONS;
    default:
      return NIKE_STORY_SECTIONS; // fallback
  }
}
