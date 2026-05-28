/** Test DB only — never defaults to production DATABASE_URL. */
export function getTestDatabaseUrl(): string {
  return (
    process.env.TEST_DATABASE_URL ??
    "postgresql://postgres:postgres@localhost:5432/ody_test"
  );
}
