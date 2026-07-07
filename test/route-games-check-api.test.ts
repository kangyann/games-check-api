type ListGames = "mobile-legends" | "free-fire" | "point-blank";
interface ListGamesObj {
  code: string;
  userId: string | number;
  serverId?: string | number;
}

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
class test_RouteGamesCheckApi {
  private ApiEndpointUrl: string = `http://localhost:3000/api/check-games?type=`; // ?={typeGames}
  private apikey: string = ""; // Fill With your x-api-key from mylix.app
  private typeGames: Record<ListGames, Partial<ListGamesObj>>;

  constructor(typeGames: Record<ListGames, Partial<ListGamesObj>>) {
    this.typeGames = typeGames;
  }

  public async Check() {
    const lengthTypeGamesObject = Object.keys(this.typeGames).length;
    for (let i = 0; i < lengthTypeGamesObject; i++) {
      const game: Partial<ListGamesObj> = this.typeGames[Object.keys(this.typeGames)[i] as ListGames];
      const url = this.ApiEndpointUrl + game.code;
      const payload = {
        userId: game.userId,
        ...(game.serverId && { serverId: game.serverId }),
      };

      await delay(1000);

      try {
        const requestCheckGames = await fetch(url, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-api-key": this.apikey,
          },
          body: JSON.stringify(payload),
        });
        const response = await requestCheckGames.json();
        if (!requestCheckGames.ok) {
          throw new Error(response.message);
        }
        console.log(
          `[✅ PASSED][${url}][${requestCheckGames.status}]${response?.data?.username && `[${response.data.username}]`}`,
        );
      } catch (error) {
        console.log(`[❌ FAILURE][${url}][${error}]`);
      }
    }
  }
}

const typeGames = {
  "mobile-legends": {
    code: "mobile-legends",
    userId: 114144928,
    serverId: 2576,
  },
  "free-fire": {
    code: "free-fire",
    userId: 271485640,
  },
  "point-blank": {
    code: "point-blank",
    userId: "red_death2",
  },
  "8-ball-pool": {
    code: "8-ball-pool",
    userId: 4959999997,
  },
};

const test = new test_RouteGamesCheckApi(typeGames);
test.Check();
