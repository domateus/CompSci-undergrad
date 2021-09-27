// Desenvolver um algoritmo que crie um processo pai, 
//e a partir deste processo pai crie  3 outros processos
// filhos utilizando fork().
// O processo pai deve entrar em loop infinito.
// O processo filho 1, deve imprimir o seu pid 
//e o pid do grupo e terminar.
// O processo filho 2, deve realizar a cópia de um 
//arquivo utilizando uma system call.
// O processo filho 3, deve esperar o processo filho 2 
//terminar e enviar um sinal para o processo pai, 
//para que este saia do loop e seja terminado, 
//após 5 segundos do recebimento do sinal.
#include <unistd.h>
#include <stdlib.h>
#include <stdio.h>
#include <signal.h>
#include <wait.h>

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
    int status, parent_pid, pid1, pid2;
    parent_pid = getpid();
    pid1 = fork();
    pid2 = fork();
    

    if(pid1 != 0 && pid2 == 0){
		printf("Processo 1 - pid: %d e grupo: %d\n",getpid(), getpgrp());
		sleep(2);
		return 0;
	} else if (pid1 == 0 && pid2 == 0) {
        printf("\nProcesso 2\n");
        printf("  Copiando arquivo\n");
        sleep(2);
        system("cp arquivo.txt copia_do_arquivo.txt");
        printf("  Arquivo copiado, encerrando execucao\n");
        sleep(2);
        exit(1);

    } else if (pid1 == 0 && pid2 != 0) {
        waitpid(pid2, &status, WUNTRACED);
        printf("\nProcesso 3, deve enviar um sinal para %d\n", parent_pid);
        sleep(2);
        kill(parent_pid, 42);
    } else {
        for(;;)
            signal(42, on_signal);
    }
 

    
}
