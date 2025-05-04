import * as React from "react";
import { render, screen } from "@testing-library/react";
import { Badge, badgeVariants } from "@/components/ui/badge"

// Mock the cn utility
jest.mock("@/lib/utils", () => ({
    cn: jest.fn().mockImplementation((...args) => args.join(" ")),
}));

describe("Badge Component", () => {
    // Test default rendering
    it("renders with default variant", () => {
        render(<Badge>Default Badge</Badge>);
        const badge = screen.getByText("Default Badge");

        expect(badge).toBeInTheDocument();
        expect(badge).toHaveClass(
            badgeVariants({ variant: "default" })
        );
    });

    // Test variants
    it.each([
        ["default", "bg-primary text-primary-foreground"],
        ["secondary", "bg-secondary text-secondary-foreground"],
        ["destructive", "bg-destructive text-destructive-foreground"],
        ["outline", "text-foreground"],
    ])("applies correct classes for %s variant", (variant, expectedClass) => {
        /* eslint-disable @typescript-eslint/no-explicit-any */
        render(<Badge variant={variant as any}>Test</Badge>);
        const badge = screen.getByText("Test");

        expect(badge).toHaveClass(expectedClass);
        expect(badge).toHaveClass("inline-flex items-center rounded-md border");
    });

    // Test className merging
    it("merges custom className with default classes", () => {
        const customClass = "custom-class";
        render(<Badge className={customClass}>Test</Badge>);
        const badge = screen.getByText("Test");

        expect(badge).toHaveClass(customClass);
        expect(badge).toHaveClass(
            badgeVariants({ variant: "default" })
        );
    });

    // Test focus styles
    it("applies focus styles", () => {
        render(<Badge>Test</Badge>);
        const badge = screen.getByText("Test");

        expect(badge).toHaveClass("focus:outline-none");
        expect(badge).toHaveClass("focus:ring-2");
        expect(badge).toHaveClass("focus:ring-ring");
        expect(badge).toHaveClass("focus:ring-offset-2");
    });

    // Test base styles are always applied
    it("always applies base styles", () => {
        render(<Badge variant="outline">Test</Badge>);
        const badge = screen.getByText("Test");

        expect(badge).toHaveClass("inline-flex");
        expect(badge).toHaveClass("items-center");
        expect(badge).toHaveClass("rounded-md");
        expect(badge).toHaveClass("border");
        expect(badge).toHaveClass("px-2.5");
        expect(badge).toHaveClass("py-0.5");
        expect(badge).toHaveClass("text-xs");
        expect(badge).toHaveClass("font-semibold");
        expect(badge).toHaveClass("transition-colors");
    });

    // Test props forwarding
    it("forwards additional props to the div element", () => {
        render(<Badge data-testid="badge" id="test-badge">Test</Badge>);
        const badge = screen.getByTestId("badge");

        expect(badge).toHaveAttribute("id", "test-badge");
    });
});