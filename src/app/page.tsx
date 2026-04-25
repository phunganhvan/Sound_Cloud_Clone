import MainSlider from "@/components/main/main.slider";
import { Container } from "@mui/material";
// import { sendRequestJS } from "@/utils/old.api";
import { sendRequest } from "@/utils/api";



export default async function HomePage() {
  // const res=await fetch(`http://localhost:8000/api/v1/tracks/top`, {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   body: JSON.stringify({
  //     category: "CHILL",
  //     limit: 10,
  //   }),
  // }) 
  // const data= await res.json();
  const chills= await sendRequest<IBackendRes<ITrackTop[]>>({
    url: "http://localhost:8000/api/v1/tracks/top",
    method: "POST",
    body: {
      category: "CHILL",
      limit: 10,
    }
  });
  const party= await sendRequest<IBackendRes<ITrackTop[]>>({
    url: "http://localhost:8000/api/v1/tracks/top",
    method: "POST",
    body: {
      category: "PARTY",
      limit: 10,
    }
  });
  const workout= await sendRequest<IBackendRes<ITrackTop[]>>({
    url: "http://localhost:8000/api/v1/tracks/top",
    method: "POST",
    body: {
      category: "WORKOUT",
      limit: 10,
    }
  });
  // console.log("res", res.data[0]);
  return (
    <>
      <Container>
        <MainSlider  
          data={chills?.data ? chills.data : []}
          title ="Chill Tracks"
        />
        <MainSlider  
          data={party?.data ? party.data : []}
          title="Party Tracks"
        />
        <MainSlider  
          data={workout?.data ? workout.data : []}
          title="Workout Tracks"
        />
      </Container>
    </>
  );
}
