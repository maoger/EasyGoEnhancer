// 删除 注释【//】：^\s*//[\s\S]*?\n
// 删除 注释【/* */】：^\s*/\*[\s\S]*?\n\*/\n
// 删除 空白行：^\s*\n

// 删除 xml注释：^\s*<!-[\s\S]*?-->


// 压缩: uglifyjs ./build/full.js -c -m -o eg.min.js