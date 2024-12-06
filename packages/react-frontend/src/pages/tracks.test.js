import React from "react";
import Tracks from "./tracks";
import { render, fireEvent, cleanup } from "@testing-library/react";

afterEach(cleanup);

test("see more button", () => {
    const onClick = jest.fn();
    const { getByText } = render(<Tracks {..."See More"} onClick={onClick} />)
    fireEvent.click(getByText("See More"));
    expect(onClick).toHaveBeenCalled();
});

test("see all button", () => {
    const onClick = jest.fn();
    const { getByText } = render(<Tracks {..."See All"} onClick={onClick} />)
    fireEvent.click(getByText("See All"));
    expect(onClick).toHaveBeenCalled();
});

test("create playlist button", () => {
    const onClick = jest.fn();
    const { getByText } = render(<Tracks {..."Create Playlist"} onClick={onClick} />)
    fireEvent.click(getByText("Create Playlist"));
    expect(onClick).toHaveBeenCalled();
});
