const baseURL =
  import.meta.env.VITE_SERVER_URL || "https://wdd330-backend.onrender.com/";

function convertToJson(res) {
  if (res.ok) {
    return res.json();
  } else {
    throw new Error(`Bad Response: ${res.status} ${res.statusText}`);
  }
}

export default class ExternalServices {
  constructor() {
    // Make sure baseURL ends with a slash and uses HTTPS
    let url = baseURL.endsWith("/") ? baseURL : baseURL + "/";
    this.baseURL = url.replace("http://", "https://");
  }

  async getData(category) {
    try {
      const response = await fetch(
        this.baseURL + `products/search/${category}`,
      );
      const data = await convertToJson(response);
      return data.Result;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }

  async findProductById(id) {
    const response = await fetch(`${this.baseURL}product/${id}`);
    const data = await convertToJson(response);
    return data.Result;
  }

  async checkout(payload) {
    const options = {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    };
    return await fetch(this.baseURL + "checkout/", options).then(convertToJson);
  }
}
