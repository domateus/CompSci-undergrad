#include <sys/types.h>
#include <sys/ipc.h>
#include <sys/sem.h>
#include <unistd.h>
#include <stdlib.h>
#include <stdio.h>
#include <signal.h>
#include <wait.h>
#include "biblioteca_dijkastra.h"
#define KEY 4242

void on_signal(int sig) {
    printf("\nProcesso %d recebeu um sinal %d\n", getpid(), sig);
    printf("Iniciando contagem para finalizar o processo\n5\n");
    sleep(1);
    printf("4\n");
    sleep(1);
    printf("3\n");
    sleep(1);
    printf("2\n");
    sleep(1);
    printf("1\n");
    sleep(1);
    printf("Processo encerrado\n");
    exit(42);
    return;
}


int main() {
    pid_t child_1, child_2, child_3;
    int sem = sem_create(KEY, 1);
   
    ((child_1 = fork()) && (child_2 = fork()) && (child_3 = fork()));


    if (child_1 == 0) {
        printf("Processo 1 - pid: %d e grupo: %d\n",getpid(), getpgrp());
		sleep(2);
		return 0;
    } else if (child_2 == 0) {
        P(sem);
        printf("\nProcesso 2\n");
        printf("  Copiando arquivo\n");
        sleep(2);
        system("cp arquivo.txt copia_do_arquivo.txt");
        printf("  Arquivo copiado, encerrando execucao\n");
        sleep(2);
        V(sem);
        exit(1);
    } else if (child_3 == 0) {
        P(sem);
        printf("\nProcesso 3, deve enviar um sinal para %d\n", getppid());
        sleep(2);
        kill(getppid(), 42);
        V(sem);
        sem_delete(sem);
    } else {
        for(;;)
            signal(42, on_signal);
    }
}