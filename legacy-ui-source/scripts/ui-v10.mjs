import assert from 'node:assert/strict';
import { mkdirSync } from 'node:fs';

const { chromium } = await import(process.env.PLAYWRIGHT_MODULE);
const output = '/tmp/hycu-v10-qa';
mkdirSync(output, { recursive: true });

const browser = await chromium.launch({
  executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  headless: true,
});
const page = await browser.newPage({ viewport: { width: 1584, height: 1668 } });
const consoleErrors = [];
const resourceErrors = [];
page.on('console', message => {
  if (message.type() === 'error' && !message.text().startsWith('Failed to load resource')) consoleErrors.push(message.text());
});
page.on('pageerror', error => consoleErrors.push(error.message));
page.on('response', response => {
  if (response.status() >= 400 && !response.url().endsWith('/favicon.ico')) resourceErrors.push(`${response.status()} ${response.url()}`);
});

try {
  await page.goto('http://127.0.0.1:4173/work/HYCU_AI_Studio_v2.html', { waitUntil: 'domcontentloaded', timeout: 30000 });
  await page.getByRole('button', { name: /로그인|시작/ }).first().click();
  await page.locator('[data-screen-label="course-setup"]').waitFor();
  await page.getByRole('button', { name: /다음 · 교안 설정/ }).click();
  await page.locator('[data-screen-label="wizard"]').waitFor();
  await page.getByRole('button', { name: /다음 · 아웃라인 생성/ }).click();
  await page.locator('[data-screen-label="outline"]').waitFor();
  await page.getByRole('button', { name: '아웃라인 생성 시작' }).click();
  await page.getByText('아웃라인 AI 수정').waitFor({ timeout: 15000 });
  await page.getByText(/아웃라인 검토 —/).waitFor({ timeout: 20000 });
  await page.screenshot({ path: `${output}/outline-1584.png` });

  await page.getByRole('button', { name: '비교표로 변경' }).click();
  await page.getByLabel(/표 포맷 미리보기/).first().waitFor();
  await page.getByRole('log').getByText(/비교표로 변경했습니다/).waitFor();
  await page.screenshot({ path: `${output}/outline-ai-1584.png` });

  for (const [width, height] of [[375, 812], [768, 1024], [1280, 900]]) {
    await page.setViewportSize({ width, height });
    await page.waitForTimeout(150);
    const stepBox = await page.locator('[aria-current="step"]').boundingBox();
    assert.ok(stepBox && stepBox.x >= 0 && stepBox.x + stepBox.width <= width, JSON.stringify({ width, stepBox }));
    if (width === 375) assert.ok((await page.locator('.process-footer').boundingBox()).height <= 70);
    if (width === 1280) assert.equal(Math.round((await page.locator('.sidebar').boundingBox()).width), 60);
    await page.screenshot({ path: `${output}/outline-${width}.png` });
  }

  await page.getByRole('button', { name: /다음 · 슬라이드 렌더/ }).click();
  await page.getByRole('button', { name: /다음 · 편집/ }).click();
  await page.getByRole('button', { name: /다음 · 검수/ }).click();
  await page.getByRole('button', { name: /다음 · 미리보기/ }).click();
  await page.getByRole('button', { name: /다음 · 내보내기/ }).click();
  await page.locator('[data-screen-label="export"]').waitFor();
  await page.getByText('최종 산출물').waitFor();
  assert.equal(await page.getByText(/다국어 번역|출력 언어 선택|번역 · 내보내기/).count(), 0);

  await page.setViewportSize({ width: 2174, height: 1478 });
  await page.getByRole('radio', { name: /PDF/ }).click();
  await page.getByRole('heading', { name: /\.pdf$/ }).waitFor();
  await page.screenshot({ path: `${output}/export-2174.png` });
  await page.getByRole('button', { name: '내보내기 시작' }).click();
  await page.getByRole('button', { name: /다운로드 완료/ }).waitFor({ timeout: 10000 });

  for (const [width, height] of [[375, 812], [768, 1024], [1280, 900]]) {
    await page.setViewportSize({ width, height });
    await page.waitForTimeout(150);
    const stepBox = await page.locator('[aria-current="step"]').boundingBox();
    assert.ok(stepBox && stepBox.x >= 0 && stepBox.x + stepBox.width <= width, JSON.stringify({ width, stepBox }));
    if (width === 375) assert.ok((await page.locator('.process-footer').boundingBox()).height <= 70);
    if (width === 1280) assert.equal(Math.round((await page.locator('.sidebar').boundingBox()).width), 60);
    await page.screenshot({ path: `${output}/export-${width}.png` });
  }

  assert.deepEqual(consoleErrors, []);
  assert.deepEqual(resourceErrors, []);
  console.log('UI flow passed');
} finally {
  await browser.close();
}
