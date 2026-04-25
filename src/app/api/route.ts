import { NextRequest,NextResponse } from "next/server";

export async function GET(request: NextRequest, response: NextResponse) {
    // connect db
    //crud db
    // return response


    const url = new URL(request.url);
    const fileName = url.searchParams.get('audio');
    // console.log(fileName);
    return await fetch(`http://localhost:8000/tracks/${fileName}`);

    // return NextResponse.json({
    //     name: "phunganhvan"
    // });
}