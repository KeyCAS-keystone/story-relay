/**
 * Microsoft Graph API 集成工具
 * 用于获取用户头像和其他 Microsoft Graph 信息
 */

/**
 * 使用 Microsoft Graph API 获取用户头像
 * 需要用户的 access_token 才能调用
 */
export async function fetchUserAvatar(accessToken: string): Promise<string> {
  try {
    // 尝试获取高质量头像 (120x120)
    const response = await fetch('https://graph.microsoft.com/v1.0/me/photo/$value', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      // 将二进制照片数据转换为 base64 URL
      const blob = await response.blob();
      return URL.createObjectURL(blob);
    }
    
    // 如果高质量头像不可用，尝试获取标准尺寸头像
    const fallbackResponse = await fetch('https://graph.microsoft.com/v1.0/me/photos/48x48/$value', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (fallbackResponse.ok) {
      const blob = await fallbackResponse.blob();
      return URL.createObjectURL(blob);
    }

    console.warn('无法从 Microsoft Graph 获取用户头像');
    return ''; // 返回空字符串，使用默认头像
  } catch (error) {
    console.error('获取 Microsoft 头像时出错:', error);
    return ''; // 返回空字符串，使用默认头像
  }
}

/**
 * 从 Microsoft Graph API 获取用户资料
 * 需要用户的 access_token 才能调用
 */
export async function fetchUserProfile(accessToken: string) {
  try {
    const response = await fetch('https://graph.microsoft.com/v1.0/me', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (response.ok) {
      return await response.json();
    }
    
    console.warn('无法从 Microsoft Graph 获取用户资料');
    return null;
  } catch (error) {
    console.error('获取 Microsoft 用户资料时出错:', error);
    return null;
  }
} 