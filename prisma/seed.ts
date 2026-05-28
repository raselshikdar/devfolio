import { config } from "dotenv";
config({ override: true });
import { db } from "@/lib/db";
import bcrypt from "bcryptjs";

async function main() {
  // Seed admin user (email: admin@alex.dev, password: admin123)
  const existingAdmin = await db.admin.findUnique({ where: { email: "admin@alex.dev" } });
  if (!existingAdmin) {
    const hashedPassword = await bcrypt.hash("admin123", 10);
    await db.admin.create({
      data: { email: "admin@alex.dev", password: hashedPassword, name: "Alex Morgan" },
    });
    console.log("✅ Admin user created: admin@alex.dev / admin123");
  } else {
    console.log("ℹ️  Admin user already exists");
  }

  // Seed profile
  const profileCount = await db.profile.count();
  if (profileCount === 0) {
    await db.profile.create({
      data: {
        name: "Alex Morgan",
        tagline: "Full-Stack Developer & Designer — crafting elegant digital experiences with modern web technologies.",
        avatar: "https://picsum.photos/seed/avatar42/300/300",
        about: "I'm a passionate full-stack developer with 7+ years of experience building high-performance web applications. I specialize in React, Next.js, and Node.js ecosystems, with a keen eye for pixel-perfect UI and scalable architecture. I thrive at the intersection of design and engineering — translating complex requirements into intuitive, accessible products. When I'm not coding, you'll find me exploring open-source projects, writing technical blog posts, or sketching UI concepts in Figma.",
        email: "alex.morgan@email.com",
        phone: "+1 (555) 123-4567",
        location: "San Francisco, CA",
        website: "alexmorgan.dev",
      },
    });
    console.log("✅ Profile seeded");
  }

  // Seed education
  const eduCount = await db.education.count();
  if (eduCount === 0) {
    await db.education.createMany({
      data: [
        { degree: "M.Sc. Computer Science", institute: "Stanford University", year: "2019 – 2021", detail: "Specialized in Machine Learning & Distributed Systems", order: 1 },
        { degree: "B.Sc. Software Engineering", institute: "MIT", year: "2015 – 2019", detail: "Graduated with Honors, GPA 3.9/4.0", order: 2 },
        { degree: "High School Diploma", institute: "Phillips Academy Andover", year: "2011 – 2015", detail: "Focus on Mathematics and Computer Science", order: 3 },
      ],
    });
    console.log("✅ Education seeded");
  }

  // Seed experience
  const expCount = await db.experience.count();
  if (expCount === 0) {
    await db.experience.createMany({
      data: [
        { role: "Senior Full-Stack Developer", company: "TechNova Inc.", year: "2023 – Present", detail: "Leading a team of 8 engineers building next-gen SaaS platform", order: 1 },
        { role: "Full-Stack Developer", company: "CloudSync Labs", year: "2021 – 2023", detail: "Built real-time collaboration tools used by 50K+ users", order: 2 },
        { role: "Frontend Developer", company: "PixelCraft Studio", year: "2019 – 2021", detail: "Designed and shipped 15+ client-facing web applications", order: 3 },
      ],
    });
    console.log("✅ Experience seeded");
  }

  // Seed skills
  const skillCount = await db.skill.count();
  if (skillCount === 0) {
    const skills = ["React", "Next.js", "TypeScript", "Node.js", "Python", "PostgreSQL", "MongoDB", "Tailwind CSS", "Docker", "AWS", "GraphQL", "Redis", "Figma", "Git", "CI/CD", "Prisma"];
    await db.skill.createMany({ data: skills.map((name, i) => ({ name, order: i })) });
    console.log("✅ Skills seeded");
  }

  // Seed projects
  const projCount = await db.project.count();
  if (projCount === 0) {
    await db.project.createMany({
      data: [
        { name: "TaskFlow", description: "AI-powered project management platform with real-time collaboration", image: "https://picsum.photos/seed/proj1/600/340", tags: "Next.js,OpenAI,Socket.io", featured: true, order: 1 },
        { name: "FinTrack", description: "Personal finance dashboard with smart budgeting and analytics", image: "https://picsum.photos/seed/proj2/600/340", tags: "React,D3.js,Node.js", featured: true, order: 2 },
        { name: "DevChat", description: "Real-time messaging app for developer teams with code snippets", image: "https://picsum.photos/seed/proj3/600/340", tags: "TypeScript,WebSocket,Redis", featured: true, order: 3 },
        { name: "EcoMarket", description: "Sustainable e-commerce platform with carbon footprint tracking", image: "https://picsum.photos/seed/proj4/600/340", tags: "Next.js,Stripe,Prisma", featured: true, order: 4 },
        { name: "MediScan", description: "Health monitoring app with ML-powered symptom analysis", image: "https://picsum.photos/seed/proj5/600/340", tags: "Python,TensorFlow,React", featured: false, order: 5 },
        { name: "LearnHub", description: "Online learning platform with interactive coding challenges", image: "https://picsum.photos/seed/proj6/600/340", tags: "Next.js,Monaco,PostgreSQL", featured: false, order: 6 },
      ],
    });
    console.log("✅ Projects seeded");
  }

  // Seed gallery images
  const imgCount = await db.galleryImage.count();
  if (imgCount === 0) {
    await db.galleryImage.createMany({
      data: [
        { src: "https://picsum.photos/seed/portfolio1/400/300", alt: "Mountain landscape", category: "Nature", order: 1 },
        { src: "https://picsum.photos/seed/portfolio2/400/300", alt: "City skyline", category: "Urban", order: 2 },
        { src: "https://picsum.photos/seed/portfolio3/400/300", alt: "Ocean waves", category: "Nature", order: 3 },
        { src: "https://picsum.photos/seed/portfolio4/400/300", alt: "Forest trail", category: "Nature", order: 4 },
      ],
    });
    console.log("✅ Gallery images seeded");
  }

  // Seed notes
  const noteCount = await db.note.count();
  if (noteCount === 0) {
    await db.note.createMany({
      data: [
        { title: "On Building for Scale", content: "The best architectures emerge not from upfront design, but from iterative refinement. Start simple, measure often, and refactor ruthlessly.", date: "May 20, 2026", order: 1 },
        { title: "Design is How It Works", content: "Beautiful interfaces that don't solve real problems are just decoration. Always start with the user's pain point and work backwards to the solution.", date: "Apr 15, 2026", order: 2 },
        { title: "The Power of Boring Tech", content: "Choose proven technologies for your stack. Innovation belongs in your product, not your infrastructure. Boring tech lets you move fast with confidence.", date: "Mar 08, 2026", order: 3 },
      ],
    });
    console.log("✅ Notes seeded");
  }

  // Seed quotes
  const quoteCount = await db.quote.count();
  if (quoteCount === 0) {
    await db.quote.createMany({
      data: [
        { text: "Code is like humor. When you have to explain it, it's bad.", context: "On writing clean code", order: 1 },
        { text: "First, solve the problem. Then, write the code.", context: "On thinking before coding", order: 2 },
        { text: "Simplicity is the soul of efficiency.", context: "On keeping things simple", order: 3 },
      ],
    });
    console.log("✅ Quotes seeded");
  }

  // Seed blog posts
  const blogCount = await db.blogPost.count();
  if (blogCount === 0) {
    await db.blogPost.createMany({
      data: [
        { title: "Building Scalable APIs with Next.js Server Actions", date: "May 15, 2026", excerpt: "A deep dive into leveraging server actions for type-safe, performant API design.", image: "https://picsum.photos/seed/blog1/600/340", tags: "Next.js,API,Server Actions", published: true, order: 1 },
        { title: "The Future of CSS: What's Coming in 2027", date: "Apr 28, 2026", excerpt: "Exploring upcoming CSS features that will transform how we build interfaces.", image: "https://picsum.photos/seed/blog2/600/340", tags: "CSS,Frontend,Design", published: true, order: 2 },
        { title: "Why I Switched from Redux to Zustand", date: "Apr 10, 2026", excerpt: "My journey simplifying state management with a lighter, more intuitive library.", image: "https://picsum.photos/seed/blog3/600/340", tags: "React,State Management,Zustand", published: true, order: 3 },
      ],
    });
    console.log("✅ Blog posts seeded");
  }

  // Seed store products
  const storeCount = await db.storeProduct.count();
  if (storeCount === 0) {
    await db.storeProduct.createMany({
      data: [
        { name: "UI Component Kit", price: "$29", image: "https://picsum.photos/seed/store1/300/200", category: "Components", rating: 4.8, order: 1 },
        { name: "React Hooks Handbook", price: "$19", image: "https://picsum.photos/seed/store2/300/200", category: "Books", rating: 4.9, order: 2 },
        { name: "Design System Template", price: "$39", image: "https://picsum.photos/seed/store3/300/200", category: "Design", rating: 4.7, order: 3 },
      ],
    });
    console.log("✅ Store products seeded");
  }

  // Seed social links
  const socialCount = await db.socialLink.count();
  if (socialCount === 0) {
    await db.socialLink.createMany({
      data: [
        { platform: "GitHub", url: "#", icon: "Github", handle: "@alexmorgan", order: 1 },
        { platform: "LinkedIn", url: "#", icon: "Linkedin", handle: "in/alexmorgan", order: 2 },
        { platform: "Twitter / X", url: "#", icon: "Twitter", handle: "@alexmorgan_dev", order: 3 },
        { platform: "Instagram", url: "#", icon: "Instagram", handle: "@alex.codes", order: 4 },
        { platform: "YouTube", url: "#", icon: "Youtube", handle: "Alex Morgan Dev", order: 5 },
        { platform: "Facebook", url: "#", icon: "Facebook", handle: "Alex Morgan", order: 6 },
        { platform: "Dribbble", url: "#", icon: "Dribbble", handle: "@alexmorgan", order: 7 },
      ],
    });
    console.log("✅ Social links seeded");
  }

  console.log("\n🎉 Seeding complete!");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(async () => { await db.$disconnect(); });
