import { useEffect } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import "@/styles/blog-v2.css";

const Blog = () => {
  // New creator photos array
  const creatorPhotos = [
    "https://cdn.builder.io/api/v1/image/assets%2Fc135df136d3b488b90d8e0548092ee36%2F51e6c70dbccc449386d0318a5732c576?format=webp&width=800&height=1200",
    "https://cdn.builder.io/api/v1/image/assets%2Fc135df136d3b488b90d8e0548092ee36%2F7bd2d26944bc4be992f69ff8310f7547?format=webp&width=800&height=1200",
    "https://cdn.builder.io/api/v1/image/assets%2Fc135df136d3b488b90d8e0548092ee36%2Fc2b7edd47ed44d61ac341825985c36ec?format=webp&width=800&height=1200",
    "https://cdn.builder.io/api/v1/image/assets%2Fc135df136d3b488b90d8e0548092ee36%2Ffce0818769c54a63bffa9c4c526b5cd1?format=webp&width=800&height=1200"
  ];

  const getSlug = (title: string) => {
    return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  };

  useEffect(() => {
    window.scrollTo(0, 0);
    
    // Load ionicons for the blog page icons
    const scriptModule = document.createElement("script");
    scriptModule.type = "module";
    scriptModule.src = "https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js";
    document.body.appendChild(scriptModule);

    const scriptNoModule = document.createElement("script");
    scriptNoModule.setAttribute("nomodule", "");
    scriptNoModule.src = "https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js";
    document.body.appendChild(scriptNoModule);

    return () => {
      document.body.removeChild(scriptModule);
      document.body.removeChild(scriptNoModule);
    };
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Navigation />

      <main className="flex-grow pt-16 blog-v2-container">
        <article>
          {/* HERO */}
          <section className="section hero" aria-label="home">
            <div className="container">
              <h1 className="h1 hero-title">
                <strong className="strong">Hey, we’re StoriesByFoot.</strong> See our stories and ideas.
              </h1>

              <div className="wrapper">
                <form action="" className="newsletter-form">
                  <input type="email" name="email_address" placeholder="Your email address" className="email-field" />
                  <button type="submit" className="btn">Subscribe</button>
                </form>
                <p className="newsletter-text">
                  Get the email newsletter and unlock access to members-only content and updates
                </p>
              </div>
            </div>
          </section>

          {/* FEATURED POST */}
          <section className="section featured" aria-label="featured post">
            <div className="container">
              <p className="section-subtitle">
                Get started with our <strong className="strong">best stories</strong>
              </p>

              <ul className="has-scrollbar">
                {[
                  {
                    img: "https://cdn.builder.io/api/v1/image/assets%2F38907e16c2b24b1c9506101e9da64675%2F88c16ea4201f47efbdcac71a50d59736?format=webp&width=800&height=1200",
                    authors: [creatorPhotos[0], creatorPhotos[1]],
                    tags: ["Adventure", "Ladakh", "Bike Trip"],
                    title: "Leh Ladakh Bike Trip Guide",
                    text: "Your ultimate guide to a Leh Ladakh bike trip in 2026. Discover routes, estimated costs, essential gear, and the new frontier of high-altitude adventure."
                  },
                  {
                    img: "https://cdn.builder.io/api/v1/image/assets%2F38907e16c2b24b1c9506101e9da64675%2Fd4bae44be0e9463d88284c94c7864fb6?format=webp&width=800&height=1200",
                    authors: [creatorPhotos[2]],
                    tags: ["Adventure", "Ladakh", "Packing List"],
                    title: "Things to carry in Ladakh bike trip",
                    text: "The difference between a legendary adventure and a difficult ordeal lies in your luggage. Curating the definitive Ladakh motorcycle tour essentials list for 2026."
                  },
                  {
                    img: "https://cdn.builder.io/api/v1/image/assets%2F38907e16c2b24b1c9506101e9da64675%2Fb0d2ca0d73d543cca91fa57e3ac820d4?format=webp&width=800&height=1200",
                    authors: [creatorPhotos[3]],
                    tags: ["Adventure", "Ladakh", "Fuel Guide"],
                    title: "Petrol Pump Guide of Ladakh",
                    text: "Managing your petrol is a strategy, not just geography. Here is the definitive guide to fueling your 2026 Himalayan expedition."
                  },
                  {
                    img: "https://cdn.builder.io/api/v1/image/assets%2F38907e16c2b24b1c9506101e9da64675%2Fa3fba2d39f774b1c96d372fad4d1624f?format=webp&width=800&height=1200",
                    authors: [creatorPhotos[0], creatorPhotos[1]],
                    tags: ["Adventure", "Ladakh", "Zanskar"],
                    title: "Zanskar the Hidden Gem",
                    text: "Zanskar is not just a destination; it is a feeling of raw, untouched isolation. Explore the ultimate frontier for 2026."
                  },
                  {
                    img: "https://cdn.builder.io/api/v1/image/assets%2F38907e16c2b24b1c9506101e9da64675%2F24d24a707cc643f7805e01014c9729dc?format=webp&width=800&height=1200",
                    authors: [creatorPhotos[1]],
                    tags: ["Adventure", "Ladakh", "Biking Guide"],
                    title: "Ladakh the Land of High Passes",
                    text: "Understanding the geography, culture, and logistics of Ladakh is the first step toward a successful journey. Your ultimate 2026 biking guide."
                  },
                  {
                    img: "https://cdn.builder.io/api/v1/image/assets%2F38907e16c2b24b1c9506101e9da64675%2F185980dad62644ec9323a878100c0e46?format=webp&width=800&height=1200",
                    authors: [creatorPhotos[2]],
                    tags: ["Adventure", "Culture", "Ladakh"],
                    title: "Aryan's Village of India in Ladakh",
                    text: "Discover the lost Aryan Valley, home to the Brokpa people and descendants of Alexander the Great's soldiers. Explore the Flower Women of Ladakh and ancient traditions in this hidden Himalayan sanctuary."
                  },
                  {
                    img: "https://cdn.builder.io/api/v1/image/assets%2F38907e16c2b24b1c9506101e9da64675%2Fa653e20b16664f5180a31400843ce642?format=webp&width=800&height=1200",
                    authors: [creatorPhotos[2]],
                    tags: ["Culture", "Myths", "Ladakh"],
                    title: "Pregnancy Tourism In Ladakh",
                    text: "Separating fact from fiction: Understanding the reality of the Brokpa community and debunking sensationalist narratives about 'Pregnancy Tourism' in the Aryan Valley."
                  }
                ].map((post, index) => (
                  <li key={index} className="scrollbar-item">
                    <div className="blog-card">
                      <Link to={`/blog/${getSlug(post.title)}`} className="block">
                        <figure className="card-banner img-holder" style={{ "--width": 500, "--height": 600 } as any}>
                          <img src={post.img} width="500" height="600" loading="lazy" alt={post.title} className="img-cover" />
                          <ul className="avatar-list absolute">
                            {post.authors.map((author, aIdx) => (
                              <li key={aIdx} className="avatar-item">
                                <span className="avatar img-holder" style={{ "--width": 100, "--height": 100 } as any}>
                                  <img src={author} width="100" height="100" loading="lazy" alt="Author" className="img-cover" />
                                </span>
                              </li>
                            ))}
                          </ul>
                        </figure>
                      </Link>
                      <div className="card-content">
                        <ul className="card-meta-list">
                          {post.tags.map((tag, tIdx) => (
                            <li key={tIdx}><span className="card-tag">{tag}</span></li>
                          ))}
                        </ul>
                        <h3 className="h4">
                          <Link to={`/blog/${getSlug(post.title)}`} className="card-title hover:underline block">
                            <strong className="strong">{post.title}</strong>
                          </Link>
                        </h3>
                        <p className="card-text">{post.text}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* RECENT POST */}
          <section className="section recent" aria-label="recent post">
            <div className="container">
              <div className="title-wrapper">
                <h2 className="h2 section-title">
                  See what we’ve <strong className="strong">written lately</strong>
                </h2>
                <div className="top-author">
                  <ul className="avatar-list">
                    {[
                      "https://cdn.builder.io/api/v1/image/assets%2Fc135df136d3b488b90d8e0548092ee36%2F51e6c70dbccc449386d0318a5732c576?format=webp&width=800&height=1200",
                      "https://cdn.builder.io/api/v1/image/assets%2Fc135df136d3b488b90d8e0548092ee36%2F7bd2d26944bc4be992f69ff8310f7547?format=webp&width=800&height=1200",
                      "https://cdn.builder.io/api/v1/image/assets%2Fc135df136d3b488b90d8e0548092ee36%2Fc2b7edd47ed44d61ac341825985c36ec?format=webp&width=800&height=1200",
                      "https://cdn.builder.io/api/v1/image/assets%2Fc135df136d3b488b90d8e0548092ee36%2Ffce0818769c54a63bffa9c4c526b5cd1?format=webp&width=800&height=1200"
                    ].map((img, i) => (
                      <li key={i} className="avatar-item">
                        <a href="#" className="avatar large img-holder" style={{ "--width": 100, "--height": 100 } as any}>
                          <img src={img} width="100" height="100" alt="top author" className="img-cover" />
                        </a>
                      </li>
                    ))}
                  </ul>
                  <span className="span">Meet our top authors</span>
                </div>
              </div>

              <ul className="grid-list">
                {[
                  {
                    img: "/assets/blog-images/recent-1.jpg",
                    authors: [creatorPhotos[2], creatorPhotos[0]],
                    tags: ["Lifestyle", "People", "Review"],
                    title: "Creating is a privilege but it’s also a gift",
                    text: "Nullam vel lectus vel velit pellentesque dignissim nec id magna. Cras molestie ornare quam at semper. Proin a ipsum ex. Curabitur eu venenatis justo. Nullam felis augue, imperdiet at sodales a, sollicitudin nec risus."
                  },
                  {
                    img: "/assets/blog-images/recent-2.jpg",
                    authors: [creatorPhotos[0]],
                    tags: ["Design", "Product", "Idea"],
                    title: "Being unique is better than being perfect",
                    text: "Nam in pretium dui. Phasellus dapibus, mi at molestie cursus, neque eros aliquet nisi, non efficitur nisi est nec mi. Nullam semper, ligula a luctus ornare, leo turpis fermentum lectus, quis volutpat urna orci a lectus. Duis et odio lobortis, auctor justo ut, egestas magna."
                  },
                  {
                    img: "/assets/blog-images/recent-3.jpg",
                    authors: [creatorPhotos[1], creatorPhotos[0], creatorPhotos[2]],
                    tags: ["Idea", "Product", "Review"],
                    title: "Now we’re getting somewhere",
                    text: "Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Donec volutpat rhoncus quam, a feugiat elit gravida eget. Curabitur id pharetra ligula. Integer porttitor suscipit ante ac faucibus. Sed a enim non enim viverra pulvinar vel diam ut lorem congue feugiat."
                  },
                  {
                    img: "/assets/blog-images/recent-4.jpg",
                    authors: [creatorPhotos[2]],
                    tags: ["Lifestyle", "Design"],
                    title: "The trick to getting more done is to have the freedom to roam around",
                    text: "Integer nec mi cursus, blandit est et, auctor mauris. Aenean ex metus, faucibus in mattis at, tincidunt eu dolor. Cras hendrerit massa nec augue placerat rutrum. Sed facilisis massa enim, ac tempus diam elementum sit amet."
                  },
                  {
                    img: "/assets/blog-images/recent-5.jpg",
                    authors: [creatorPhotos[0], creatorPhotos[1]],
                    tags: ["People", "Story", "Lifestyle"],
                    title: "Every day, in every city and town across the country",
                    text: "Morbi a facilisis lectus. Ut eu dapibus risus, a interdum justo. Vestibulum volutpat velit ac tellus mollis, sit amet sodales metus elementum. Aliquam eu mi massa. Proin suscipit enim a pulvinar viverra."
                  },
                  {
                    img: "/assets/blog-images/recent-6.jpg",
                    authors: [creatorPhotos[1]],
                    tags: ["People", "Review", "Story"],
                    title: "Your voice, your mind, your story, your vision",
                    text: "Nullam auctor nisi non tortor porta, id dapibus lectus rhoncus. Vivamus lobortis posuere enim finibus sodales. Phasellus quis tellus scelerisque, sagittis tortor et, maximus metus."
                  }
                ].map((post, index) => (
                  <li key={index}>
                    <div className="blog-card">
                      <Link to={`/blog/${getSlug(post.title)}`} className="block">
                        <figure className="card-banner img-holder" style={{ "--width": 550, "--height": 660 } as any}>
                          <img src={post.img} width="550" height="660" loading="lazy" alt={post.title} className="img-cover" />
                          <ul className="avatar-list absolute">
                            {post.authors.map((author, aIdx) => (
                              <li key={aIdx} className="avatar-item">
                                <span className="avatar img-holder" style={{ "--width": 100, "--height": 100 } as any}>
                                  <img src={author} width="100" height="100" loading="lazy" alt="Author" className="img-cover" />
                                </span>
                              </li>
                            ))}
                          </ul>
                        </figure>
                      </Link>
                      <div className="card-content">
                        <ul className="card-meta-list">
                          {post.tags.map((tag, tIdx) => (
                            <li key={tIdx}><span className="card-tag">{tag}</span></li>
                          ))}
                        </ul>
                        <h3 className="h4">
                          <Link to={`/blog/${getSlug(post.title)}`} className="card-title hover:underline block">
                            <strong className="strong">{post.title}</strong>
                          </Link>
                        </h3>
                        <p className="card-text">{post.text}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>

              <button className="btn" style={{ marginInline: "auto", marginBlock: "50px 30px" }}>Load more</button>
            </div>
          </section>

          {/* RECOMMENDED POST */}
          <section className="section recommended" aria-label="recommended post">
            <div className="container">
              <p className="section-subtitle">
                <strong className="strong">Recommended</strong>
              </p>
              <ul className="grid-list">
                {[
                  { img: "/assets/blog-images/recommended-1.jpg", authors: [creatorPhotos[0], creatorPhotos[1]], title: "The trick to getting more done is to have the freedom to roam around" },
                  { img: "/assets/blog-images/recommended-2.jpg", authors: [creatorPhotos[2]], title: "Every day, in every city and town across the country" },
                  { img: "/assets/blog-images/recommended-3.jpg", authors: [creatorPhotos[0]], title: "I work best when my space is filled with inspiration" },
                  { img: "/assets/blog-images/recommended-4.jpg", authors: [creatorPhotos[3], creatorPhotos[2]], title: "I have my own definition of minimalism" },
                  { img: "/assets/blog-images/recommended-5.jpg", authors: [creatorPhotos[1]], title: "Change your look and your attitude" },
                  { img: "/assets/blog-images/recommended-6.jpg", authors: [creatorPhotos[2]], title: "The difference is quality" }
                ].map((post, index) => (
                  <li key={index}>
                    <div className="blog-card">
                      <Link to={`/blog/${getSlug(post.title)}`} className="block">
                        <figure className="card-banner img-holder" style={{ "--width": 300, "--height": 360 } as any}>
                          <img src={post.img} width="300" height="360" loading="lazy" alt={post.title} className="img-cover" />
                          <ul className="avatar-list absolute">
                            {post.authors.map((author, aIdx) => (
                              <li key={aIdx} className="avatar-item">
                                <span className="avatar img-holder" style={{ "--width": 100, "--height": 100 } as any}>
                                  <img src={author} width="100" height="100" loading="lazy" alt="Author" className="img-cover" />
                                </span>
                              </li>
                            ))}
                          </ul>
                        </figure>
                      </Link>
                      <div className="card-content">
                        <h3 className="h5">
                          <Link to={`/blog/${getSlug(post.title)}`} className="card-title hover:underline block">
                            <strong className="strong">{post.title}</strong>
                          </Link>
                        </h3>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          {/* NEWSLETTER */}
          <section className="section newsletter">
            <h2 className="h2 section-title">
              Subscribe to <strong className="strong">new posts</strong>
            </h2>
            <form action="" className="newsletter-form">
              <input type="email" name="email_address" placeholder="Your email address" required className="email-field" />
              <button type="submit" className="btn">Subscribe</button>
            </form>
          </section>
        </article>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
