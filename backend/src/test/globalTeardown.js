export default async function globalTeardown() {
  await global.__MONGOINSTANCE__.stop()
}
