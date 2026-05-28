import { Component, type ErrorInfo, type ReactNode } from "react";
import { Text, View } from "react-native";

import { tokens } from "../tokens";
import { Button } from "./Button";
import { Card } from "./Card";

type ErrorBoundaryProps = {
  children: ReactNode;
  fallbackTitle?: string;
  onReset?: () => void;
};

type ErrorBoundaryState = {
  hasError: boolean;
  message?: string;
};

const styles = {
  wrap: {
    flex: 1,
    alignItems: "center" as const,
    justifyContent: "center" as const,
    padding: tokens.spacing[6],
    backgroundColor: tokens.semantic.background,
  },
  message: {
    fontSize: tokens.typography.fontSize.sm,
    color: tokens.semantic.textMuted,
    marginTop: tokens.spacing[2],
    textAlign: "center" as const,
  },
};

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, message: error.message };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info.componentStack);
  }

  private handleReset = () => {
    this.setState({ hasError: false, message: undefined });
    this.props.onReset?.();
  };

  render() {
    if (!this.state.hasError) {
      return this.props.children;
    }

    return (
      <View style={styles.wrap}>
        <Card variant="outlined" style={{ maxWidth: 420, width: "100%" }}>
          <Text
            style={{
              fontSize: tokens.typography.fontSize.xl,
              fontWeight: tokens.typography.fontWeight.bold,
              color: tokens.semantic.text,
            }}
          >
            {this.props.fallbackTitle ?? "Something went wrong"}
          </Text>
          {this.state.message ? (
            <Text style={styles.message}>{this.state.message}</Text>
          ) : null}
          <Button label="Try again" onPress={this.handleReset} style={{ marginTop: tokens.spacing[4] }} />
        </Card>
      </View>
    );
  }
}
