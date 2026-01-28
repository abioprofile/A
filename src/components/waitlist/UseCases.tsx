"use client";

export default function UseCases() {
  const useCases = [
    {
      num: "01.",
      title: "Professional Networkers & Business",
      bullets: [
        `Seamless Exchange: Sales or Web3 professionals can instantly share their full contact details, Twitter profile, LinkedIn profile with a single tap of their Acard on a client's phone at conferences or meetings.`,
        `Networking at Scale: At industry conferences, attendees can quickly exchange information without fumbling for paper business cards that often get lost or tossed.`,
        `Lead Tracking & Follow-up: Sales teams can use the analytics feature to track the number of taps and profile visits, helping them gauge interest and prioritize follow-ups after an event.`,
        `Dynamic Business Cards: A small business owner can update their profile (e.g., change their phone number or add a new promotion) without having to reprint hundreds of cards.`,
      ],
      bg: "bg-[#FF854A]",
    },
    {
      num: "02.",
      title: "Content Creators & Influencers",
      bullets: [
        `Instant Social Connect: A creator can instantly share a link stack that includes their latest TikTok, Instagram, YouTube, and portfolio links with fans or collaborators at meet-ups or events.`,
        `Monetization & Merch: Creators can include direct links to their merchandise store or their latest affiliate links on their dynamic profile.`,
        `Audience Insight: Tracking the clicks on specific links (e.g., "portfolio" vs. "Instagram") allows creators to understand what their audience is most interested in.`,
      ],
      bg: "bg-[#331400]",
    },
    {
      num: "03.",
      title: "Service Industry & Events",
      bullets: [
        `Restaurant/Hotel Staff: Staff can have a custom-branded Acard to share a direct link to a customer satisfaction survey, or a QR code for the Wi-Fi password.`,
        `Real Estate Agents: An agent can tap their card to instantly share their digital business card, a link to their active listings, or a virtual tour.`,
        `Event Check-in: Events or conferences can use this to create branded digital passes for instant, personalized attendee check-in and information sharing.`,
      ],
      bg: "bg-[#44A479]",
    },
    {
      num: "04.",
      title: "Everyday Individuals & Students",
      bullets: [
        `Personal Identity Management: Students or graduates can share their professional resume, a personal portfolio, and all their active social media accounts with recruiters or new friends.`,
        `Central Hub: Having one central profile and a physical card eliminates the need to dictate multiple social media handles or phone numbers when meeting new people.`,
      ],
      bg: "bg-[#FED45C]",
      textColor: "text-black",
    },
  ];

  return (
    <section className="w-full bg-white py-16">
      <div className="max-w-7xl mx-auto px-6">
        <h4 className="text-4xl md:text-4xl trialheader font-semibold text-center mb-12 text-[#FF0000]">
          Who can use Abio.site?
        </h4>

        <div className="flex flex-col gap-16">
          {useCases.map((item, index) => (
            <div
              key={index}
              className={`flex flex-col md:flex-row ${
                index % 2 === 1 ? "md:flex-row-reverse" : ""
              } items-center justify-between gap-8`}
            >
              {/* Number + Title */}
              <div className="flex-1 max-w-[500px] flex flex-col items-center md:items-start justify-center text-[#5D2D2B] text-center md:text-left">
                <div className="text-7xl h-playfair trial2 italic font-bold mb-2">{item.num}</div>
                <h5 className="text-3xl md:text-4xl trial2 italic font-semibold">{item.title}</h5>
              </div>

              {/* Colored Box */}
              <div
                className={`flex-1 max-w-[500px] ${item.bg} shadow p-8  ${
                  item.textColor ? item.textColor : "text-white"
                }`}
              >
                <ul className="list-disc pl-5 space-y-3 text-sm leading-relaxed">
                  {item.bullets.map((b, i) => (
                    <li key={i}>{b}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}




