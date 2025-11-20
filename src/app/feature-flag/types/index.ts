export interface FeatureFlagContext {
  location?: string;
}

export interface FeatureFlagDto {
  featureFlagName: string;
  context: FeatureFlagContext;
}

export interface FeatureFlagResponse {
  location?: boolean;
}
