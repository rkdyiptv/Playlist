// ==========================================
// M3U PLAYLIST FILTER - CLOUDFLARE WORKER
// ==========================================

// 🔧 CONFIGURE YOUR M3U URL HERE
const M3U_PLAYLIST_URL = 'http://b1g.uk:80/get.php?username=201&password=102&type=m3u_plus';
// Replace with your actual M3U playlist URL
// Example: 'https://iptv-org.github.io/iptv/index.m3u'

export default {
  async fetch(request) {
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    try {
      // Fetch the M3U playlist
      const response = await fetch(M3U_PLAYLIST_URL, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch playlist: ${response.status} ${response.statusText}`);
      }

      let content = await response.text();

      // Validate M3U format
      if (!content.includes('#EXTM3U') && !content.includes('#EXTINF')) {
        return new Response(
          JSON.stringify({ 
            error: 'Invalid M3U playlist format',
            source: M3U_PLAYLIST_URL 
          }),
          { 
            status: 400,
            headers: { 
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            }
          }
        );
      }

      // 🧹 Filter out video formats (keep only audio streams)
      const videoFormats = /\.(mp4|mkv|avi|flv|webp|webm|divx|ts|mov|wmv|m4v)(\?[^\n]*)?\n?/gi;
      
      const lines = content.split('\n');
      const filtered = [];
      let skipNext = false;

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        
        // Check if next line contains video format
        if (line.startsWith('#EXTINF') && i + 1 < lines.length) {
          const nextLine = lines[i + 1];
          if (videoFormats.test(nextLine)) {
            skipNext = true;
            continue;
          }
        }

        if (skipNext) {
          skipNext = false;
          continue;
        }

        filtered.push(line);
      }

      content = filtered.join('\n');

      // Clean up extra blank lines
      content = content.replace(/\n{3,}/g, '\n\n');

      // Count streams
      const totalStreams = (content.match(/#EXTINF/g) || []).length;
      const originalStreams = (await response.text()).match(/#EXTINF/g)?.length || 0;
      const removedStreams = originalStreams - totalStreams;

      // Return filtered playlist
      return new Response(content, {
        headers: {
          'Content-Type': 'audio/mpegurl; charset=utf-8',
          'Content-Disposition': 'attachment; filename="filtered_playlist.m3u"',
          'Access-Control-Allow-Origin': '*',
          'Cache-Control': 'public, max-age=300',
          'X-Total-Streams': totalStreams.toString(),
          'X-Removed-Streams': removedStreams.toString(),
          'X-Source-URL': M3U_PLAYLIST_URL,
        },
      });

    } catch (error) {
      return new Response(
        JSON.stringify({
          error: 'Server Error',
          message: error.message,
          source: M3U_PLAYLIST_URL,
          tip: 'Check if the M3U URL is publicly accessible',
        }),
        {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        }
      );
    }
  },
};
