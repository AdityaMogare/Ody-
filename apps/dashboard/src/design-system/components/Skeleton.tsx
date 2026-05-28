import { useEffect, useRef } from "react";
import { Animated, View, type StyleProp, type ViewStyle } from "react-native";

import { useStyles } from "../createStyles";
import { useTheme } from "../theme";
import type { Theme } from "../theme";

export type SkeletonProps = {
  width?: number | `${number}%`;
  height?: number;
  borderRadius?: number;
  style?: StyleProp<ViewStyle>;
};

function createSkeletonStyles(t: Theme) {
  return {
    bone: {
      backgroundColor: t.semantic.border,
      overflow: "hidden" as const,
    },
    shimmer: {
      backgroundColor: t.semantic.surfaceMuted,
      opacity: 0.6,
    },
  };
}

export function Skeleton({
  width = "100%",
  height = 16,
  borderRadius,
  style,
}: SkeletonProps) {
  const styles = useStyles(createSkeletonStyles);
  const { radii } = useTheme();
  const opacity = useRef(new Animated.Value(0.35)).current;

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(opacity, { toValue: 1, duration: 700, useNativeDriver: true }),
        Animated.timing(opacity, { toValue: 0.35, duration: 700, useNativeDriver: true }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [opacity]);

  return (
    <View
      style={[
        styles.bone,
        {
          width,
          height,
          borderRadius: borderRadius ?? radii.sm,
        },
        style,
      ]}
    >
      <Animated.View style={[styles.shimmer, { flex: 1, opacity }]} />
    </View>
  );
}

export function SkeletonText({ lines = 3 }: { lines?: number }) {
  return (
    <View style={{ gap: 8 }}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton key={i} height={14} width={i === lines - 1 ? "70%" : "100%"} />
      ))}
    </View>
  );
}
