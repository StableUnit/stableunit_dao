module.exports = {
  "!contracts/periphery/**/*.ts?(x)": [],
  '**/*.ts?(x)': () => 'tsc -p tsconfig.json --noEmit --skipLibCheck'
}