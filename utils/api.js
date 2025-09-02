const MENU_URL = 'https://raw.githubusercontent.com/Meta-Mobile-Developer-PC/Working-With-Data-API/main/capstone.json'

export const fetchMenu = async () => {
  try {
    console.log('Fetching data from API');
    const response = await fetch(MENU_URL)
    const json = await response.json();
    return json.menu;
  } catch(error) {
     console.error("API fetch error:", error);
  }
}

