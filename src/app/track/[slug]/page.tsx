'use client'
import WaveTrack from '@/components/tracks/wave.track';
import { useSearchParams } from 'next/navigation'
import Container from '@mui/material/Container';
const DetailTrackPage = ({ params }: { params: { slug: string } }) => {
    const searchParams = useSearchParams();
    const audioName = searchParams.get('audio');
    return (
        <>
            <Container>
                {/* <div>
                    Detail track {params.slug}
                </div> */}
                
                    <WaveTrack />
            </Container>
        </>
    )
}
export default DetailTrackPage;

