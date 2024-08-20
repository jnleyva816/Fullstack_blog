import { test, expect } from './fixtures/index.js'

test('create post', async ({ page, auth }) => {
  const testUser = await auth.signUpAndLogIn()
  await page.locator('#create_title').click()
  await page.locator('#create_title').fill('Test post ')
  await page.locator('#create_title').press('Tab')
  await page.locator('textarea').fill('Hello World!')
  await page.locator('textarea').press('Tab')
  await page.getByRole('button', { name: 'Create' }).press('Enter')
  await expect(page.getByText(`Test post by ${testUser}`)).toBeVisible()
})
