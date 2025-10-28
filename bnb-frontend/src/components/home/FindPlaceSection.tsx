import SearchBar from "./SearchBar";

export default function FindPlaceSection() {
  return (
    <section className="relative min-h-[600px] flex items-center justify-center overflow-hidden">
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url("/hero-bg.jpeg")`, opacity: 0.4 }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-background/70 via-background/50 to-background" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-foreground">
              Find Your Perfect Stay
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Discover amazing apartments and homes for your next adventure
            </p>
          </div>

          {/* Search Bar */}
          <SearchBar />
        </div>
      </div>
    </section>
  );
}
