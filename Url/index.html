export default {
  async fetch(request) {
    try {
      const url = new URL(request.url).searchParams.get("url");
      if (!url)
        return json({ success: false, error: "Missing ?url=" });

      const link = await tech_unblocked(url);

      return json({
        success: true,
        link: link
      });

    } catch (err) {
      return json({
        success: false,
        error: err.toString()
      });
    }
  }
};

const UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
  + "AppleWebKit/537.36 (KHTML, like Gecko) "
  + "Chrome/122.0.0.0 Safari/537.36";

function extractFormAction(html) {
  return html.match(/<form^>]*action=["'["']/i)?.[1];
}

function extractInputs(html) {
  const inputs = {};
  const regex = /<input^>]*name=["'"'][^>]*value=["'["']/gi;
  let m;
  while ((m = regex.exec(html)) !== null) {
    inputs[m[1]] = m[2];
  }
  return inputs;
}

function encodeForm(obj) {
  return Object.keys(obj)
    .map(k => encodeURIComponent(k) + "=" + encodeURIComponent(obj[k]))
    .join("&");
}

function formHeaders() {
  return {
    "Content-Type": "application/x-www-form-urlencoded",
    "User-Agent": UA
  };
}

function absoluteURL(path, base) {
  try {
    return new URL(path, base).href;
  } catch {
    return path;
  }
}

async function tech_unblocked(url) {
  let r1 = await fetch(url, {
    headers: { "User-Agent": UA }
  });
  let t1 = await r1.text();
  const action1 = absoluteURL(extractFormAction(t1), url);
  console.log(action1);
  const data1 = extractInputs(t1);
  console.log(data1);
  let r2 = await fetch(action1, {
    method: "POST",
    headers: formHeaders(),
    body: encodeForm(data1)
  });
  let t2 = await r2.text();
  const action2 = absoluteURL(extractFormAction(t2), action1);
  console.log(action2);
  const data2 = extractInputs(t2);
  console.log(data2);
  let r3 = await fetch(action2, {
    method: "POST",
    headers: formHeaders(),
    body: encodeForm(data2)
  });
  let t3 = await r3.text();
  const goUrl = t3.match(/"(https?:\/\/.*?go=.*?)"/)?.[1];
  if (!goUrl) throw new Error("go= URL not found");

  // Extract cookie key/value: s_343('key','value')
  const cookieMatch = t3.match(/s_343\('([^']+)'\s*,\s*'(.+?)'\s*,/);
  const cookieKey = cookieMatch?.[1];
  const cookieVal = cookieMatch?.[2];
  const cookie = ${cookieKey}=${cookieVal};
  console.log(cookie);
  let r4 = await fetch(goUrl, {
    method: "POST",
    headers: {
      "Cookie": cookie,
      "User-Agent": UA
    }
  });
  let t4 = await r4.text();
  const final = t4.match(/url=(https?:\/\/\S+?)"/)?.[1];
  return final;
}
