export class SaveDataManager{

    static {
        this.loadData()
        this.HIGH_SCORES_STR = "highScores";
    }

    static loadData(){
        if(!window.localStorage.getItem(this.HIGH_SCORES_STR)){
            this.highScores = [0, 0, 0, 0, 0];
        }
        else{
            this.highScores = JSON.parse(window.localStorage.getItem(this.HIGH_SCORES_STR));
        }
    }

    static addScore(score){
        this.loadData();
        for(let i = 0; i < this.highScores.length; i++){
            if(this.highScores[i] < score){
                this.highScores.splice(i, 1);
                this.highScores.push(score);
                this.highScores.sort((a, b) => {
                    if(a > b){
                        return -1;
                    }
                    else if (a < b){
                        return 1;
                    }
                    return 0;
                });
                break;
            }
        }
        window.localStorage.setItem(this.HIGH_SCORES_STR, JSON.stringify(this.highScores));
    }

    static getScores(){
        this.loadData();
        return this.highScores;
    }

    static clearScores(){
        window.localStorage.setItem(this.HIGH_SCORES_STR, null);
        this.highScores = [0, 0, 0, 0, 0];
    }
}