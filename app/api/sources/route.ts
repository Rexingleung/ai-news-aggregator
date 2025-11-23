import { NextResponse } from 'next/server';
import dataSources from '@/config/data-sources.json';

export async function GET() {
  return NextResponse.json({
    sources: dataSources,
    total: dataSources.length,
  });
}

// 注意：在生产环境中，配置更新应该写入数据库而不是JSON文件
// 这里仅作为演示
export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // 在实际应用中，这里应该更新数据库
    // 目前仅返回接收到的数据
    return NextResponse.json({
      message: 'Configuration received (not persisted in demo)',
      data: body,
    });
  } catch (error) {
    return NextResponse.json(
      { error: 'Failed to update sources' },
      { status: 500 }
    );
  }
}
