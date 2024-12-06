import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom"; // For Link components
import Home from "./Home"; // Adjust this path based on your project structure

// Mock dependencies
jest.mock("../components/visualizations/genreBarGraph", () => () => (
  <div>GenreBarGraph Mock</div>
));
jest.mock("../components/visualizations/imageGrid", () => () => (
  <div>ImageGrid Mock</div>
));
jest.mock("../components/popularityBar", () => () => (
  <div>PopularityBar Mock</div>
));
jest.mock("../components/listItem", () => ({ index, image, name }) => (
  <div data-testid="list-item">
    {index}. {name}
  </div>
));

// Mock data for props
const mockProps = {
  time_range: "short_term",
  genreCounts: {
    "1M": [{ genre: "pop", percentage: 50 }],
  },
  allArtists: {
    "1M": [{ name: "Artist 1", images: [{ url: "artist1.jpg" }] }],
  },
  allTracks: {
    "1M": [{ name: "Track 1", album: { images: [{ url: "track1.jpg" }] } }],
  },
  allAlbums: {
    "1M": [{ name: "Album 1", images: [{ url: "album1.jpg" }] }],
  },
  username: "TestUser",
  profilePicture: "profile.jpg",
};

// Helper to wrap Home component with a Router
const renderWithRouter = (ui) => {
  return render(<BrowserRouter>{ui}</BrowserRouter>);
};

describe("Home Component", () => {
  it("renders all major sections", () => {
    renderWithRouter(<Home {...mockProps} />);

    // Check for intro section
    expect(
      screen.getByText("Explore and share your top artists, tracks, and more.")
    ).toBeInTheDocument();

    // Check for User Info section
    expect(screen.getByText("TestUser")).toBeInTheDocument();

    // Check for Top Artists, Tracks, and Albums
    expect(screen.getByText("Top Artists")).toBeInTheDocument();
    expect(screen.getByText("Top Tracks")).toBeInTheDocument();
    expect(screen.getByText("Top Albums")).toBeInTheDocument();

    // Check for Genre Listening Trends section
    expect(screen.getByText("Genre Listening Trends")).toBeInTheDocument();
  });

  it("renders top artists, tracks, and albums correctly", () => {
    renderWithRouter(<Home {...mockProps} />);

    // Check for Top Artists
    const artistItems = screen.getAllByTestId("list-item");
    expect(artistItems[0]).toHaveTextContent("1. Artist 1");

    // Check for Top Tracks
    expect(artistItems[1]).toHaveTextContent("1. Track 1");

    // Check for Top Albums
    expect(artistItems[2]).toHaveTextContent("1. Album 1");
  });

  it("navigates to details pages on clicking View Details", () => {
    renderWithRouter(<Home {...mockProps} />);

    const artistLink = screen.getByText("View Details", { selector: "a" });
    expect(artistLink).toHaveAttribute("href", "/artists");

    const trackLink = screen.getByText("View Details", { selector: "a" });
    expect(trackLink).toHaveAttribute("href", "/tracks");

    const albumLink = screen.getByText("View Details", { selector: "a" });
    expect(albumLink).toHaveAttribute("href", "/albums");
  });

  it("updates state when time_range changes", () => {
    const { rerender } = renderWithRouter(<Home {...mockProps} />);

    // Check initial state (short_term)
    expect(screen.getAllByTestId("list-item")[0]).toHaveTextContent(
      "1. Artist 1"
    );

    // Update props to simulate medium_term
    rerender(
      <BrowserRouter>
        <Home
          {...mockProps}
          time_range="medium_term"
          allArtists={{
            "6M": [{ name: "Artist 2", images: [{ url: "artist2.jpg" }] }],
          }}
          allTracks={{
            "6M": [{ name: "Track 2", album: { images: [{ url: "track2.jpg" }] } }],
          }}
          allAlbums={{
            "6M": [{ name: "Album 2", images: [{ url: "album2.jpg" }] }],
          }}
        />
      </BrowserRouter>
    );

    // Check updated state
    expect(screen.getAllByTestId("list-item")[0]).toHaveTextContent(
      "1. Artist 2"
    );
  });
});
