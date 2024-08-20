export class AuthFixture {
  constructor(page) {
    this.page = page
  }
  async signUpAndLogIn() {
    const testUser = 'test' + Date.now()
    await this.page.goto('/')
    await this.page.getByRole('link', { name: 'Sign up' }).click()
    await this.page.getByLabel('Username:').click()
    await this.page.getByLabel('Username:').fill(testUser)
    await this.page.getByLabel('Username:').press('Tab')
    await this.page.getByLabel('Password:').fill('test')
    await this.page.getByRole('button', { name: 'Sign up' }).click()
    await this.page.waitForURL('**/login')
    await this.page.getByLabel('Username:').click()
    await this.page.getByLabel('Username:').fill(testUser)
    await this.page.getByLabel('Username:').press('Tab')
    await this.page.getByLabel('Password:').fill('test')
    await this.page.getByRole('button', { name: 'Log in' }).click()
    await this.page.waitForURL('**/')
    return testUser
  }
}
