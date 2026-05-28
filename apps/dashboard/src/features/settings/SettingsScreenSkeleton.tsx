import { View } from "react-native";

import { Card, Skeleton, useTheme } from "../../design-system";

export function SettingsScreenSkeleton() {
  const theme = useTheme();

  return (
    <View style={{ flex: 1, padding: theme.spacing[6], gap: theme.spacing[4] }}>
      <Skeleton height={32} width="40%" />
      {Array.from({ length: 3 }).map((_, i) => (
        <Card key={i} variant="outlined" style={{ gap: theme.spacing[3] }}>
          <Skeleton height={20} width="30%" />
          <Skeleton height={40} />
          <Skeleton height={40} />
        </Card>
      ))}
      <Skeleton height={44} width={160} />
    </View>
  );
}
