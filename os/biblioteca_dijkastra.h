/* SEMÁFOROS DE DIJKASTRA - BIBLIOTECA*/
int sem_create(key_t key, int initval){
	int semid;
	union semun{
		int val;
		struct semid_ds *buf;
		ushort array[1];
	}arg_ctl;
	semid = semget(ftok("dijkastra.h", key),1,IPC_CREAT|IPC_EXCL|0666);
	if(semid==-1){
		semid=semget(ftok("dijkastra.h", key),1,0666);
		if(semid==-1){
			printf("Erro semget()\n");
			exit(1);
		}
	}
	arg_ctl.val = initval;
	if(semctl(semid,0,SETVAL,arg_ctl)==-1){
		printf("Erro semctl()\n");
		exit(1);
	}
	return(semid);
}
void P(int semid){
	struct sembuf sempar[1];
	sempar[0].sem_num=0;
	sempar[0].sem_op=-1;
	sempar[0].sem_flg=SEM_UNDO;
	if(semop(semid, sempar, 1)==-1) printf("Erro P()\n");
}
void V(int semid){
	struct sembuf sempar[1];
	sempar[0].sem_num=0;
	sempar[0].sem_op=1;
	sempar[0].sem_flg=SEM_UNDO;
	if(semop(semid, sempar, 1)==-1) printf("Erro V()\n");
}
void sem_delete(int semid){
	if(semctl(semid,0,IPC_RMID,0)==-1) printf("Erro IPC_RMID\n");
}
