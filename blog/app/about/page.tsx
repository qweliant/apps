import { ReactNode } from "react";

interface AboutSectionProps {
  title: string;
  children: ReactNode;
}

interface QuoteProps {
  children: ReactNode;
}

const AboutSection = ({ title, children }: AboutSectionProps) => (
  <section className="mb-8">
    <h2 className="text-2xl font-bold mb-4 text-gray-800">{title}</h2>
    <div className="prose prose-lg max-w-none text-gray-600">{children}</div>
  </section>
);

const Quote = ({ children }: QuoteProps) => (
  <blockquote className="border-l-4 border-blue-500 pl-4 my-4 italic text-gray-700">
    {children}
  </blockquote>
);

export default function Page() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <header className="mb-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">About Me</h1>
        <p className="text-xl text-gray-600">
          Technology enthusiast, perpetual learner, and aspiring gardner
        </p>
      </header>

      <AboutSection title="Vision">
        <p>
          I am inspired by the belief that technology has the potential to level
          barriers to access and provide transparency to complex collaboration,
          ultimately shifting the zero-sum mentality we have today. I am
          passionate about open source knowledge systems. Tools like the
          Internet Archive are for the future what Voyager is to the unknown.
          Collective intelligence makes knowledge better by opening the process
          of knowledge creation to criticism and veracity, both creating space
          and removing barriers for collective stewwardship.
        </p>
      </AboutSection>

      <AboutSection title="Early Years">
        <p>
          In 8th grade, I received a &quot;Don&apos;t Hide Your Smarts Award&quot;
          after a school transfer - an ironic achievement for being a mediocre
          student. This began a journey of self-discovery and questioning
          societal norms. My love for storytelling was ignited in 11th grade
          when I discovered One Piece.
        </p>
      </AboutSection>

      <AboutSection title="Educational Journey">
        <p>
          After high school, my path took unexpected turns. Initially dreaming
          of becoming an audio engineer in Spartanburg, South Carolina,
          financial constraints led me to community college. This detour
          introduced me to computer engineering through my friend Anthony Munoz.
        </p>
        <p className="mt-4">
          At Clemson, despite academic struggles and loneliness, I found a
          community that believed in me. Special thanks to Bekk and Lorenzo for
          legitimizing my early coding endeavors.
        </p>
      </AboutSection>

      <AboutSection title="Professional Evolution">
        <p>
          My career path included stints at a startup, research at
          Clemson&apos;s TRACE Lab, and attendance at a coding bootcamp. When
          traditional paths proved challenging, I turned to Twitter, where I
          discovered Black Tech Pipeline. This led me to explore open source
          technologies and decentralized systems, where I found my passion for
          building tools that make technology more accessible and knowledge more
          open.
        </p>
      </AboutSection>

      <AboutSection title="Future Vision">
        <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-6 rounded-lg">
          <Quote>
            <p className="font-semibold text-gray-800">
              My ultimate goal is to contribute to humanity&apos;s
              interplanetary future. I envision Mars terraforming, exploration
              of Europa, and the advance of multiple species beyond our current
              limitations. Like on some Star Trek TNG type shi, I believe in
              reason, exploration, and the boundless potential of human
              achievement.
            </p>
          </Quote>
        </div>
      </AboutSection>
    </div>
  );
}
