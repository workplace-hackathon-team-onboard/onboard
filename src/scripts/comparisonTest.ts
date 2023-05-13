import { compare } from '../service/comparisonService';

const testQuestion = 'How did you get started in this industry?';
const testAnswer1 =
  'I got started in the software industry during my college years. I had always been fascinated by computers and technology, so I decided to pursue a degree in computer science. Throughout my coursework, I gained a solid foundation in programming languages, algorithms, and software development methodologies. To enhance my practical skills, I actively participated in coding competitions and personal projects. During my final year, I interned at a software company, where I worked on a real-world project and gained valuable industry experience. This internship opened doors for me, and upon graduation, I secured a full-time position as a junior software engineer. Since then, I have been continuously learning and growing in my career, taking on increasingly challenging projects and advancing to the role of Senior Software Engineer.';
const testAnswer2 =
  'My journey into the software industry began in a rather unconventional way. Although I initially pursued a degree in electrical engineering, I realized my true passion lay in software development during my sophomore year. Intrigued by coding and its potential to create impactful solutions, I began taking online courses and exploring various programming languages. I immersed myself in self-study, building small projects and collaborating with like-minded individuals. This hands-on experience helped me develop a solid skill set and a deep understanding of software engineering principles. After completing my degree, I transitioned into a software engineering role at a startup. The fast-paced environment allowed me to work on diverse projects and exposed me to the full software development life cycle. I learned the importance of agile methodologies, effective collaboration, and delivering high-quality software products. Over time, I honed my skills, took on leadership responsibilities, and progressed to the position of Senior Software Engineer. My journey demonstrates that dedication, continuous learning, and a genuine passion for software development can pave the way to a successful career in this industry.';

(async () => {
  const comparison = await compare(
    testQuestion,
    'bob',
    testAnswer1,
    'billy',
    testAnswer2,
  );
  console.log(comparison);
})();
