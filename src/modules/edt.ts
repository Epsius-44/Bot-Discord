import {IEdtEpsiJS} from "../types";

export async function getEdtEpsi(login: string, date: Date, timeoutMs: number): Promise<IEdtEpsiJS[]> {
    try {
        const fetchPromise = fetch(`https://epsius-connect.luzilab.net/edt-epsi?login=${login}&date=${date.getTime().toString()}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        });

        //ajouter un timeout pour la requête
        const timeoutPromise = new Promise((_, reject) => {
            setTimeout(() => {
                reject(new Error("Timeout reached"));
            }, timeoutMs); // 30 seconds
        });

        //récupérer la réponse et la parser en JSON
        const response = await Promise.race([fetchPromise, timeoutPromise]);
        if (response instanceof Response) {
            return await response.json();
        } else {
            return;
        }
    } catch
        (error) {
        throw error;
    }
}