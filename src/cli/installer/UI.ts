import pc from 'picocolors';

export const BANNER = `
${pc.cyan('   _____            _   _             _ ')}
${pc.cyan('  / ____|          | | (_)           | |')}
${pc.cyan(' | (___   ___ _ __ | |_ _ _ __   ___| |')}
${pc.cyan('  \\___ \\ / _ \\ \'_ \\| __| | \'_ \\ / _ \\ |')}
${pc.cyan('  ____) |  __/ | | | |_| | | | |  __/ |')}
${pc.cyan(' |_____/ \\___|_| |_|\\__|_|_| |_|\\___|_|')}
${pc.cyan('                                       ')}
${pc.cyan('            K E R N E L                ')}
`;

export function showBanner() {
  console.log(BANNER);
  console.log(pc.gray(' Deterministic Governance for AI Agents\n'));
}
