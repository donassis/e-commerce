import * as React from "react";
import { render, screen } from "@testing-library/react";
import {
    Card,
    CardHeader,
    CardTitle,
    CardDescription,
    CardContent,
    CardFooter,
} from "@/components/ui/card";

// Mock the cn utility
jest.mock("@/lib/utils", () => ({
    cn: jest.fn().mockImplementation((...args) => args.filter(Boolean).join(" ")),
}));

describe("Card Components", () => {
    describe("Card", () => {
        it("renders with default classes and forwards ref", () => {
            const ref = React.createRef<HTMLDivElement>();
            render(<Card ref={ref}>Card Content</Card>);

            const card = screen.getByText("Card Content");
            expect(card).toBeInTheDocument();
            expect(card).toHaveClass(
                "rounded-xl border bg-card text-card-foreground shadow"
            );
            expect(ref.current).toBeInstanceOf(HTMLDivElement);
        });

        it("merges custom className with default classes", () => {
            render(<Card className="custom-class">Test</Card>);
            const card = screen.getByText("Test");
            expect(card).toHaveClass(
                "rounded-xl border bg-card text-card-foreground shadow custom-class"
            );
        });

        it("forwards additional props to the div element", () => {
            render(<Card data-testid="card" id="test-card">Test</Card>);
            const card = screen.getByTestId("card");
            expect(card).toHaveAttribute("id", "test-card");
        });
    });

    describe("CardHeader", () => {
        it("renders with default classes", () => {
            render(<CardHeader>Header Content</CardHeader>);
            const header = screen.getByText("Header Content");
            expect(header).toHaveClass("flex flex-col space-y-1.5 p-6");
        });

        it("forwards ref and additional props", () => {
            const ref = React.createRef<HTMLDivElement>();
            render(<CardHeader ref={ref} data-testid="header">Test</CardHeader>);

            const header = screen.getByTestId("header");
            expect(ref.current).toBeInstanceOf(HTMLDivElement);
            expect(header).toBeInTheDocument();
        });
    });

    describe("CardTitle", () => {
        it("renders with default typography classes", () => {
            render(<CardTitle>Card Title</CardTitle>);
            const title = screen.getByText("Card Title");
            expect(title).toHaveClass("font-semibold leading-none tracking-tight");
        });
    });

    describe("CardDescription", () => {
        it("renders with muted text styles", () => {
            render(<CardDescription>Description text</CardDescription>);
            const desc = screen.getByText("Description text");
            expect(desc).toHaveClass("text-sm text-muted-foreground");
        });

        it("merges custom className correctly", () => {
            render(<CardDescription className="mb-4">Test</CardDescription>);
            const desc = screen.getByText("Test");
            expect(desc).toHaveClass("text-sm text-muted-foreground mb-4");
        });
    });

    describe("CardContent", () => {
        it("renders with proper padding and no top padding", () => {
            render(<CardContent>Main content</CardContent>);
            const content = screen.getByText("Main content");
            expect(content).toHaveClass("p-6 pt-0");
        });

        it("forwards ref correctly", () => {
            const ref = React.createRef<HTMLDivElement>();
            render(<CardContent ref={ref}>Test</CardContent>);
            expect(ref.current).toBeInstanceOf(HTMLDivElement);
        });
    });

    describe("CardFooter", () => {
        it("renders with flex alignment and proper padding", () => {
            render(<CardFooter>Footer items</CardFooter>);
            const footer = screen.getByText("Footer items");
            expect(footer).toHaveClass("flex items-center p-6 pt-0");
        });

        it("can contain multiple child elements", () => {
            render(
                <CardFooter>
                    <button>Action 1</button>
                    <button>Action 2</button>
                </CardFooter>
            );
            const buttons = screen.getAllByRole("button");
            expect(buttons).toHaveLength(2);
        });
    });

    describe("Component Composition", () => {
        it("works correctly when composed together", () => {
            render(
                <Card>
                    <CardHeader>
                        <CardTitle>Title</CardTitle>
                        <CardDescription>Description</CardDescription>
                    </CardHeader>
                    <CardContent>Main content</CardContent>
                    <CardFooter>Footer</CardFooter>
                </Card>
            );

            expect(screen.getByText("Title")).toBeInTheDocument();
            expect(screen.getByText("Description")).toBeInTheDocument();
            expect(screen.getByText("Main content")).toBeInTheDocument();
            expect(screen.getByText("Footer")).toBeInTheDocument();
        });
    });
});