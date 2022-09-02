//? Types

export type Laptop = { 
    image: string, 
    name: string,
    id: number
};

export type CPU = {
    id: number,
    name: string
};

export type User = { 
    name: string,
    surname: string,
    team_id: number,
    position_id: number,
    email: string,
    phone_number: string
};

export type SingleLaptopType = {
    user: {
        name: string,
        surname: string,
    },
    laptop: {
        image: string,
        name: string,
        id: number
    }
}

export type FullLaptop = {
    user: {
        name: string,
        surname: string,
        email: string,
        phone: string,
        position_id: number,
        team_id: number
    },
    laptop: {
        image: string,
        name: string,
        id: number,
        cpu: {
            name: string,
            cores: number,
            threads: number,    
        }
        brand_id: number,
        ram: number,
        hard_drive_type: string,
        state: string,
        price: number,
        date: string
    }
}

export type Team = { id: number, name: string };
export type Position = { id: number, name: string, team_id: number };
