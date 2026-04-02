const Team = () => {
  const teamMembers = [
    {
      name: "Diana Robinson",
      position: "Founder, Owner",
      phone: "+1 323-913-4688",
      image: "https://res.cloudinary.com/dqz8fkrx0/image/upload/v1640082281/cliffhanger/user-1-118x118_bzbvvi.jpg"
    },
    {
      name: "Peter McMillan",
      position: "Travel Agent",
      phone: "+1 323-913-4688",
      image: "https://res.cloudinary.com/dqz8fkrx0/image/upload/v1640082281/cliffhanger/user-2-118x118_mfsavv.jpg"
    },
    {
      name: "Jill Peterson",
      position: "Tour Consultant",
      phone: "+1 323-913-4688",
      image: "https://res.cloudinary.com/dqz8fkrx0/image/upload/v1640082281/cliffhanger/user-3-118x118_bkc8h2.jpg"
    },
    {
      name: "James Smith",
      position: "PR Manager",
      phone: "+1 323-913-4688",
      image: "https://res.cloudinary.com/dqz8fkrx0/image/upload/v1640082281/cliffhanger/user-4-118x118_p2xdqm.jpg"
    }
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 max-w-6xl">
        <h3 className="text-3xl font-bold text-center text-gray-800 mb-16">
          Different People — One Mission
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {teamMembers.map((member, index) => (
            <div
              key={index}
              className="text-center flex flex-col items-center"
            >
              {/* Avatar */}
              <div className="mb-6">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-32 h-32 rounded-full object-cover border-4 border-[#01b3a7] shadow-lg"
                />
              </div>

              {/* Content */}
              <div className="bg-gray-100 py-6 px-4 rounded-lg w-full">
                <h5 className="text-lg font-bold text-gray-800 mb-2">
                  {member.name}
                </h5>
                <p className="text-[#01b3a7] font-semibold mb-3 text-sm">
                  {member.position}
                </p>
                <a
                  href={`tel:${member.phone}`}
                  className="text-gray-600 text-sm hover:text-[#01b3a7] transition-colors"
                >
                  {member.phone}
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Team;
