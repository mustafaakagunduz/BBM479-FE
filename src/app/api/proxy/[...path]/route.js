// src/app/api/proxy/[...path]/route.js

export async function GET(request) {
    const path = request.nextUrl.pathname.replace('/api/proxy/', '');
    const apiUrl = `http://hrsam-be-hadi-gari-env.eba-rh4mxnj2.eu-north-1.elasticbeanstalk.com/${path}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        return Response.json(data);
    } catch (error) {
        console.error('Proxy error:', error);
        return Response.json({ error: 'Error proxying to API' }, { status: 500 });
    }
}

export async function POST(request) {
    const path = request.nextUrl.pathname.replace('/api/proxy/', '');
    const apiUrl = `http://hrsam-be-hadi-gari-env.eba-rh4mxnj2.eu-north-1.elasticbeanstalk.com/${path}`;

    try {
        const body = await request.json();
        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        return Response.json(data);
    } catch (error) {
        console.error('Proxy error:', error);
        return Response.json({ error: 'Error proxying to API' }, { status: 500 });
    }
}

export async function PUT(request) {
    const path = request.nextUrl.pathname.replace('/api/proxy/', '');
    const apiUrl = `http://hrsam-be-hadi-gari-env.eba-rh4mxnj2.eu-north-1.elasticbeanstalk.com/${path}`;

    try {
        const body = await request.json();
        const response = await fetch(apiUrl, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const data = await response.json();
        return Response.json(data);
    } catch (error) {
        console.error('Proxy error:', error);
        return Response.json({ error: 'Error proxying to API' }, { status: 500 });
    }
}

export async function DELETE(request) {
    const path = request.nextUrl.pathname.replace('/api/proxy/', '');
    const apiUrl = `http://hrsam-be-hadi-gari-env.eba-rh4mxnj2.eu-north-1.elasticbeanstalk.com/${path}`;

    try {
        const response = await fetch(apiUrl, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
        });

        const data = await response.json();
        return Response.json(data);
    } catch (error) {
        console.error('Proxy error:', error);
        return Response.json({ error: 'Error proxying to API' }, { status: 500 });
    }
}