const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

// บอก Metro ว่าเรากำลังทำเว็บนะ ให้มองหาไฟล์ .web.js เป็นอันดับแรก
config.resolver.platforms = ['web', 'ios', 'android'];
config.resolver.sourceExts = [...config.resolver.sourceExts, 'mjs', 'cjs', 'web.js', 'web.ts', 'web.tsx'];

module.exports = config;


