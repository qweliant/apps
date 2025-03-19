import { ReactNode } from "react";

interface AboutSectionProps {
  title: string;
  children: ReactNode;
}

const AboutSection = ({ title, children }: AboutSectionProps) => (
  <section className="mb-8">
    <h2 className="text-2xl font-bold mb-4 ">{title}</h2>
    <div className="prose prose-lg max-w-none">{children}</div>
  </section>
);

export default function Page() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      <header className="mb-12">
        <h1 className="text-4xl font-bold mb-4">About Me</h1>
        <p className="text-xl ">
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
          In fourth grade I guessed the right amount of hershy kisses in a
          jar... It was about 350. In 8th grade, I received a "Dont Hide Your
          Smarts" Award after a school transfer - an ironic achievement for
          being a mediocre student.
        </p>
      </AboutSection>
      <AboutSection title="One Piece">
        <p>11th grade is when I discovered One Piece.</p>
        <p>Oda is love. Oda is life.</p>
      </AboutSection>

      <AboutSection title="Educational Journey">
        <p>
          After high school, my path took unexpected turns. Initially dreaming
          of becoming an audio engineer in Spartanburg, South Carolina,
          financial constraints led me to community college. This detour
          introduced me to computer engineering through my friend Anthony.
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
          Clemson&apos;s TRACE Lab, and attendance at a coding bootcamp,
          formerly known as Lamda School. I am not sure what it known as today.
          Eeventually I was able to contribute tp open source technologies and
          decentralized knowledge frameworks, where I found my passion for
          building tools that make technology more accessible and knowledge more
          open.
        </p>
      </AboutSection>
      <AboutSection title="Adulting">
        <p>
          I find flowers and trees to be the only things that keep from that
          abyss staring back at me we call the future. Yes, the stemen keeps the
          panic away. The panic of knowing my life will end is baited by the
          fresh hibiscus and lavendar i grew hanging in my room. Ahhh, what
          horror it is to know time passes me. So thankful for angiosperms for
          keeping me sane. Send me an email on how you get by. Don&apos;t be
          wierd about it though. Unless I knwo you. Then be wierd. But I will
          snitch. So not too wierd. Like if you eat mash potatoes with your
          hands sans fufu or like wrapping yourself in saran wrap every now and
          then. I don&apos;t like those things. You might though. Wierdo.
        </p>
      </AboutSection>
    </div>
  );
}
