interface TripHighlightsProps {
  highlights: string[];
}

const TripHighlights = ({ highlights }: TripHighlightsProps) => {
  return (
    <div className="mb-8 border-t border-border pt-8">
      <h2 className="text-xl font-semibold text-foreground mb-4">Trip Highlights</h2>
      <ul className="space-y-3">
        {highlights.map((highlight, index) => (
          <li key={index} className="flex items-start gap-2 text-muted-foreground">
            <span className="mt-2 w-1.5 h-1.5 rounded-full bg-foreground flex-shrink-0" />
            <span>{highlight}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TripHighlights;
